import { ProTable } from '@ant-design/pro-components';
import Apis from '@/apis';
import React, { useEffect, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table/es/typing';
import { Button, message, Radio, Select } from 'antd';
import { SaveOutlined, MinusSquareOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { PageContent } from '@/components';

export default () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>();
  const [roleAdminList, setRoleAdminList] = useState<any[]>([]);
  const [currRoleId, setCurrRoleId] = useState();
  const [currUsers, setCurrUsers] = useState<any[]>([]);
  const [currUserId, setCurrUserId] = useState();
  const [radioValue, setRadioValue] = useState<string>('currRoleId');
  const [allMenuData, setAllMenuData] = useState<any[]>([]);

  /**
   * 拿角色列表
   */
  const loadRoleAdminList = async () => {
    try {
      const res = await Apis.system.role.getRoleAdminList();
      const roles = res?.data ?? [];
      const transformedObject = roles.map((item: any) => ({
        ...item,
        label: item.roleName,
        value: item.id,
      }));
      console.log('角色列表:', transformedObject);
      setRoleAdminList(transformedObject);
    } catch (e) {
      console.error('获取角色列表失败:', e);
      message.error('获取角色列表失败');
    }
  };

  /**
   * 拿用户列表
   */
  const loadUserList = async () => {
    try {
      const res = await Apis.system.user.getUserList({ rows: 999, status: 1 });
      const tempList = res?.rows ?? [];
      const transformedObject = tempList.map((item: any) => ({
        ...item,
        label: item.realName,
        value: item.userId,
      }));
      console.log('用户列表:', transformedObject);
      setCurrUsers(transformedObject);
    } catch (e) {
      console.error('获取用户列表失败:', e);
      message.error('获取用户列表失败');
    }
  };

  /**
   * 遍历拿到所有ck true的id
   * @param menuList
   */
  const initCheckMenuList = (menuList: any[]) => {
    try {
      const ids: number[] = [];
      const allNodes: any[] = [];
      const helper = (items: any[]) => {
        for (const item of items) {
          allNodes.push(item);
          if (item.ck === true) {
            ids.push(item.id);
          }
          if (item.children && item.children.length > 0) {
            helper(item.children);
          }
        }
      };
      helper(menuList);
      setAllMenuData(allNodes);
      setSelectedRowKeys(ids);
    } catch (e) {
      console.error('初始化菜单选择失败:', e);
    }
  };

  const buildMenuPath = (record: any): string => {
    return record.menuName || '';
  };

  const columns: ProColumns<any>[] = [
    {
      dataIndex: 'status',
      hideInTable: true,
      align: 'center',
      order: -1,
      renderFormItem: () => (
        <Radio.Group
          value={radioValue}
          onChange={(e) => setRadioValue(e.target.value)}
          optionType="button"
          buttonStyle="solid"
        >
          <Radio value="currRoleId">角色</Radio>
          <Radio value="currUsers">账号</Radio>
        </Radio.Group>
      ),
    },
    {
      title: '角色',
      dataIndex: 'roleId',
      hideInTable: true,
      hideInSearch: radioValue !== 'currRoleId',
      align: 'center',
      renderFormItem: () => (
        <Select
          allowClear
          showSearch
          placeholder="请选择角色"
          options={roleAdminList}
          optionFilterProp="label"
        />
      ),
      fieldProps: {
        showSearch: true,
        filterOption: (input: string, option: any) =>
          (option?.label ?? option?.text ?? '').toLowerCase().includes(input.toLowerCase()),
        onChange: (value: any) => {
          setCurrRoleId(value);
        },
      },
    },
    {
      title: '账号',
      dataIndex: 'userId',
      hideInTable: true,
      hideInSearch: radioValue !== 'currUsers',
      align: 'center',
      renderFormItem: () => (
        <Select
          allowClear
          showSearch
          placeholder="请选择账号"
          options={currUsers}
          optionFilterProp="label"
        />
      ),
      fieldProps: {
        showSearch: true,
        filterOption: (input: string, option: any) =>
          (option?.label ?? option?.text ?? '').toLowerCase().includes(input.toLowerCase()),
        onChange: (value: any) => {
          setCurrUserId(value);
        },
      },
    },
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      hideInSearch: true,
      align: 'left',
      render: (_: any, record: any) => buildMenuPath(record),
    },
    {
      title: '菜单地址',
      dataIndex: 'src',
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '排序',
      dataIndex: 'seq',
      align: 'center',
      hideInSearch: true,
    },
  ];

  const handleSelectionChange = (newSelectedRowKeys: React.Key[]) => {
    let finalSelectedKeys = [...newSelectedRowKeys];

    const addedKeys = newSelectedRowKeys.filter((key) => !selectedRowKeys?.includes(key));
    const removedKeys = selectedRowKeys?.filter((key) => !newSelectedRowKeys.includes(key)) || [];

    const addParentNodes = (nodeId: any) => {
      const node = allMenuData.find((n) => n.id === nodeId);
      if (!node?.parentId || finalSelectedKeys.includes(node.parentId)) return;
      finalSelectedKeys.push(node.parentId);
      addParentNodes(node.parentId);
    };

    const addChildNodes = (nodeId: any) => {
      const children = allMenuData.filter((n) => n.parentId === nodeId);
      children.forEach((child) => {
        if (!finalSelectedKeys.includes(child.id)) {
          finalSelectedKeys.push(child.id);
          addChildNodes(child.id);
        }
      });
    };

    const removeChildNodes = (nodeId: any) => {
      const children = allMenuData.filter((n) => n.parentId === nodeId);
      children.forEach((child) => {
        if (finalSelectedKeys.includes(child.id)) {
          finalSelectedKeys = finalSelectedKeys.filter((k) => k !== child.id);
          removeChildNodes(child.id);
        }
      });
    };

    addedKeys.forEach((nodeId) => {
      addParentNodes(nodeId);
      addChildNodes(nodeId);
    });

    removedKeys.forEach(removeChildNodes);

    setSelectedRowKeys(finalSelectedKeys);
  };

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    onChange: handleSelectionChange,
  };

  // 用户保存
  const saveMenuWithUserIds = async () => {
    try {
      if (currUserId) {
        const tempKeys = selectedRowKeys?.join(',');
        if (!tempKeys) {
          message.error('至少选择一个菜单');
          return;
        }
        await Apis.system.auth.saveUserMenu({
          userId: currUserId,
          menuIds: tempKeys,
        });
        loadMenuByUserId({ userId: currUserId, status: 1 });
        message.success('保存成功');
      } else {
        message.error('请先选择某个账号');
      }
    } catch (e) {
      console.error('保存用户菜单失败:', e);
      message.error('保存失败');
    }
  };

  // 角色保存
  const saveMenuWithRoleIds = async () => {
    try {
      if (currRoleId) {
        const tempKeys = selectedRowKeys?.join(',');
        if (!tempKeys) {
          message.error('至少选择一个菜单');
          return;
        }
        await Apis.system.auth.saveRoleMenu({
          roleId: currRoleId,
          menuIds: tempKeys,
        });
        loadMenuByRoleId({ roleId: currRoleId });
        message.success('保存成功');
      } else {
        message.error('请先选择某个角色');
      }
    } catch (e) {
      console.error('保存角色菜单失败:', e);
      message.error('保存失败');
    }
  };

  /**
   * 根据roleId去拉菜单
   * @param params
   */
  const loadMenuByRoleId = async (params: any) => {
    try {
      if (params && params['roleId']) {
        setCurrRoleId(params['roleId']);
        const res = await Apis.system.auth.getMenuTreeWithRole(params);
        
        initCheckMenuList(res || []);
        return { data: res || [] };
      } else {
        setSelectedRowKeys([]);
        return { data: [] };
      }
    } catch (error) {
      console.error('获取角色菜单失败:', error);
      message.error('获取角色菜单失败');
      return { data: [] };
    }
  };

  /**
   * 根据userId去拉菜单
   * @param params
   */
  const loadMenuByUserId = async (params: any) => {
    try {
      if (params && params['userId']) {
        setCurrUserId(params['userId']);
        const res = await Apis.system.auth.getMenuTreeWithUser(params);
        initCheckMenuList(res.data);
        return res;
      } else {
        setSelectedRowKeys([]);
        return { data: [] };
      }
    } catch (error) {
      console.error('获取用户菜单失败:', error);
      message.error('获取用户菜单失败');
      return { data: [] };
    }
  };

  useEffect(() => {
    loadRoleAdminList();
    loadUserList();
  }, []);

  return (
    <PageContent>
      {roleAdminList && (
        <ProTable
          rowSelection={rowSelection}
          search={{
            optionRender: false,
          }}
          params={{
            roleId: radioValue === 'currRoleId' ? currRoleId : undefined,
            userId: radioValue === 'currUsers' ? currUserId : undefined,
          }}
          toolBarRender={() => [
            <div key="primary">
              <Button
                type="primary"
                onClick={() => {
                  radioValue === 'currRoleId' ? saveMenuWithRoleIds() : saveMenuWithUserIds();
                }}
              >
                <SaveOutlined /> 保存
              </Button>
            </div>,
          ]}
          request={async (params: any) => {
            return radioValue === 'currRoleId' ? loadMenuByRoleId(params) : loadMenuByUserId(params);
          }}
          columns={columns}
          rowKey={'id'}
          sticky={{
            offsetHeader: 0,
          }}
          scroll={{ x: 800 }}
          pagination={false}
          expandable={{
            childrenColumnName: 'children',
            rowExpandable: (record: any) => {
              return !!(record.children && record.children.length > 0);
            },
            expandIcon: ({ expanded, onExpand, record }: any) => {
              if (record.children && record.children.length > 0) {
                return expanded ? (
                  <MinusSquareOutlined
                    onClick={(e) => onExpand(record, e)}
                    style={{
                      cursor: 'pointer',
                      marginRight: 8,
                      color: '#1890ff',
                      fontSize: '16px',
                    }}
                  />
                ) : (
                  <PlusSquareOutlined
                    onClick={(e) => onExpand(record, e)}
                    style={{
                      cursor: 'pointer',
                      marginRight: 8,
                      color: '#1890ff',
                      fontSize: '16px',
                    }}
                  />
                );
              }
              return <span style={{ marginRight: 24 }}></span>;
            },
          }}
        />
      )}
    </PageContent>
  );
};
