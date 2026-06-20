#!/bin/bash

echo "=========================================="
echo "员工端我的统计培训 - 验收脚本"
echo "=========================================="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

PASS_COUNT=0
FAIL_COUNT=0

check_pass() {
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ $1${NC}"
    PASS_COUNT=$((PASS_COUNT + 1))
  else
    echo -e "${RED}✗ $1${NC}"
    FAIL_COUNT=$((FAIL_COUNT + 1))
  fi
}

echo -e "\n${YELLOW}[环境检查]${NC}"

if command -v node &> /dev/null; then
  NODE_VERSION=$(node --version)
  echo -e "${GREEN}✓ Node.js 版本: $NODE_VERSION${NC}"
else
  echo -e "${RED}✗ 未安装 Node.js${NC}"
  exit 1
fi

if command -v npm &> /dev/null; then
  NPM_VERSION=$(npm --version)
  echo -e "${GREEN}✓ npm 版本: $NPM_VERSION${NC}"
else
  echo -e "${RED}✗ 未安装 npm${NC}"
  exit 1
fi

echo -e "\n${YELLOW}[1/8] 检查后端服务...${NC}"
if curl -s http://localhost:3001/api/employee/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"EMP001","password":"123456"}' | grep -q "success"; then
  check_pass "后端服务正常运行在端口 3001"
else
  echo -e "${RED}✗ 后端服务未启动，请先运行: cd backend && npm start${NC}"
  exit 1
fi

echo -e "\n${YELLOW}[2/8] 登录接口测试...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/employee/login \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"EMP001","password":"123456"}')

if echo "$LOGIN_RESPONSE" | grep -q '"code":0'; then
  TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
  EMP_NAME=$(echo "$LOGIN_RESPONSE" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
  check_pass "登录成功，用户: $EMP_NAME，Token: ${TOKEN:0:20}..."
else
  check_pass "登录失败"
  exit 1
fi

echo -e "\n${YELLOW}[3/8] 未授权访问测试...${NC}"
UNAUTH_RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:3001/api/employee/profile)
UNAUTH_BODY=$(echo "$UNAUTH_RESPONSE" | head -n1)
UNAUTH_CODE=$(echo "$UNAUTH_RESPONSE" | tail -n1)

if [ "$UNAUTH_CODE" = "401" ] && echo "$UNAUTH_BODY" | grep -q "未登录"; then
  check_pass "未授权访问正确返回 401"
else
  check_pass "未授权访问测试失败 (返回码: $UNAUTH_CODE)"
fi

echo -e "\n${YELLOW}[4/8] 获取员工信息接口测试...${NC}"
PROFILE_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/employee/profile)

if echo "$PROFILE_RESPONSE" | grep -q '"code":0'; then
  check_pass "获取员工信息接口正常"
else
  check_pass "获取员工信息接口异常"
fi

echo -e "\n${YELLOW}[5/8] 培训资料列表接口测试...${NC}"
TRAINING_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/employee/training)

if echo "$TRAINING_RESPONSE" | grep -q '"code":0'; then
  COUNT=$(echo "$TRAINING_RESPONSE" | grep -o '"total":[0-9]*' | cut -d':' -f2)
  check_pass "培训资料接口正常，共 $COUNT 条资料"
else
  check_pass "培训资料接口异常"
fi

echo -e "\n${YELLOW}[6/8] 培训资料分类接口测试...${NC}"
CATEGORY_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/employee/training/categories)

if echo "$CATEGORY_RESPONSE" | grep -q '"code":0'; then
  CATEGORIES=$(echo "$CATEGORY_RESPONSE" | grep -o '"categories":\[[^]]*\]' | grep -o '"[^"]*"' | grep -v "categories" | tr '\n' ' ')
  check_pass "分类接口正常，分类: $CATEGORIES"
else
  check_pass "分类接口异常"
fi

echo -e "\n${YELLOW}[7/8] 培训统计接口测试...${NC}"
STATS_RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/api/employee/training/stats)

if echo "$STATS_RESPONSE" | grep -q '"code":0'; then
  TOTAL=$(echo "$STATS_RESPONSE" | grep -o '"total":[0-9]*' | cut -d':' -f2)
  COMPLETED=$(echo "$STATS_RESPONSE" | grep -o '"completed":[0-9]*' | cut -d':' -f2)
  PROGRESS=$(echo "$STATS_RESPONSE" | grep -o '"totalProgress":[0-9.]*' | cut -d':' -f2)
  check_pass "培训统计接口正常，总计: $TOTAL，已完成: $COMPLETED，总进度: $PROGRESS%"
else
  check_pass "培训统计接口异常"
fi

echo -e "\n${YELLOW}[8/8] 前端页面访问测试...${NC}"
if curl -s http://localhost:5173 | grep -q "<!DOCTYPE html>"; then
  check_pass "前端页面可访问 (端口 5173)"
else
  echo -e "${YELLOW}! 前端服务未检测到，如果未启动请运行: cd frontend && npm run dev${NC}"
fi

echo -e "\n=========================================="
echo "验收结果"
echo "=========================================="
echo -e "通过: ${GREEN}$PASS_COUNT${NC}"
echo -e "失败: ${RED}$FAIL_COUNT${NC}"
echo "=========================================="

if [ $FAIL_COUNT -eq 0 ]; then
  echo -e "${GREEN}所有验收项通过！系统可以正常部署使用。${NC}"
  echo ""
  echo "测试账号："
  echo "  工号: EMP001 / 密码: 123456 (张三)"
  echo "  工号: EMP002 / 密码: 123456 (李四)"
  echo "  工号: EMP003 / 密码: 123456 (王五)"
  echo ""
  echo "访问地址："
  echo "  前端: http://localhost:5173"
  echo "  后端: http://localhost:3001"
  exit 0
else
  echo -e "${RED}存在 $FAIL_COUNT 个验收项未通过，请检查后重试。${NC}"
  exit 1
fi
