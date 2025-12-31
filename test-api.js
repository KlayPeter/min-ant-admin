// 测试后端 API 返回的数据格式
const testAPIs = async () => {
  const baseURL = 'http://localhost:8080';
  
  console.log('=== 测试角色列表 ===');
  const roleRes = await fetch(`${baseURL}/manage/sys/role/getRoleAdminList`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const roleData = await roleRes.json();
  console.log('角色数据:', JSON.stringify(roleData, null, 2));
  
  console.log('\n=== 测试菜单列表 ===');
  const menuRes = await fetch(`${baseURL}/manage/sys/menu/getMenuTree`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  const menuData = await menuRes.json();
  console.log('菜单数据:', JSON.stringify(menuData, null, 2));
  
  console.log('\n=== 测试用户列表 ===');
  const userRes = await fetch(`${baseURL}/manage/sys/user/getUserList`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page: 1, rows: 10 })
  });
  const userData = await userRes.json();
  console.log('用户数据:', JSON.stringify(userData, null, 2));
};

testAPIs().catch(console.error);
