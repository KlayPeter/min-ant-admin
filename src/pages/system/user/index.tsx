import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ExclamationCircleOutlined,
  PlusOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { Button, message, Modal, Space, Switch, Typography, Input } from "antd";
import Apis from "@/apis";
import { PageContent } from "@/components/base";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { useListRefresh } from "@/hooks";
import { EVENT_KEY } from "@/constants";
import storage from "@/utils/storage";
import UserModel from "./components/Model";

const OrgUser: React.FC = () => {
  const [searchParams] = useSearchParams();
  const roleId = searchParams.get("roleId");

  const actionRef = useRef<ActionType>(null);
  const userModelRef = useRef<{ open: (values?: any, id?: number) => void }>(
    null
  );
  const [modal, contextHolder] = Modal.useModal();
  const [editRoleList, setEditRoleList] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // 递归构建 valueEnum（包含所有层级的部门）
  const buildValueEnum = (data: any[], result: any = {}): any => {
    data.forEach((item) => {
      result[item.id] = { text: item.orgName || item.text };
      if (item.children && item.children.length > 0) {
        buildValueEnum(item.children, result);
      }
    });
    return result;
  };

  // 转换树形数据供 TreeSelect 使用
  const convertTreeForSelect = (data: any[]): any[] => {
    return data.map((item) => ({
      label: item.orgName || item.text,
      value: item.id,
      children:
        item.children?.length > 0
          ? convertTreeForSelect(item.children)
          : undefined,
    }));
  };


  /**
   * 拿角色列表
   */
  const loadRoleList = useCallback(async () => {
    const res = await Apis.system.user.getRoleList();
    
    const roleList = res || [];
    const sortedRes = [...roleList].sort((a, b) => b.id.localeCompare(a.id));
    const editRoleList = sortedRes.map((item: any) => ({
      ...item,
      label: item.roleName,
      value: item.id,
    }));
    setEditRoleList(editRoleList);
  }, []);

  const getUserList = async (params: any) => {
    const res = await Apis.system.user.getUserList(params);
    return {
      data: res.rows,
      success: true,
      total: res.total,
    };
  };

  const clickUpdateUserStatus = async (id: number, status: number) => {
    await Apis.system.user.changeUserStatus({
      userId: String(id),
      status,
    });
    message.success("操作成功");
  };

  const handleForceChangePassword = (record: any) => {
    modal.confirm({
      title: "提示",
      icon: <ExclamationCircleOutlined />,
      content: "确认要强制重置该用户的密码吗？",
      okText: "确认",
      cancelText: "取消",
      onOk: async () => {
        try {
          const res = (await Apis.system.user.forceChangePassword({
            userId: record.userId,
          })) as any;

          const newPassword = res || "";

          message.success("密码重置成功");

          modal.info({
            title: "新密码",
            icon: <InfoCircleOutlined />,
            content: (
              <div style={{ marginTop: 16 }} id="password-modal-content">
                <div style={{ marginBottom: 8, fontWeight: 500 }}>
                  请将以下密码告知用户：
                </div>
                <div style={{ position: "relative" }}>
                  <Input value={String(newPassword)} readOnly />
                  <div
                    style={{
                      position: "absolute",
                      opacity: 0,
                      pointerEvents: "auto",
                      left: 0,
                      top: 0,
                    }}
                  >
                    <Typography.Text
                      copyable={{
                        text: String(newPassword),
                        onCopy: () => {
                          message.success("密码已复制到剪贴板");
                          return false; // 阻止默认行为，避免关闭 Modal
                        },
                      }}
                    >
                      {newPassword}
                    </Typography.Text>
                  </div>
                </div>
              </div>
            ),
            okText: "复制密码",
            onOk: () => {
              // 触发 Typography.Text 的复制功能
              const modalContent = document.getElementById(
                "password-modal-content"
              );
              const copyBtn = modalContent?.querySelector(
                ".ant-typography-copy"
              ) as HTMLElement;
              if (copyBtn) {
                copyBtn.click();
              }
              actionRef.current?.reload();
            },
          });
        } catch (error) {
          message.error("密码重置失败");
        }
      },
    });
  };

  const handleSave = async (values: any, id?: number) => {
    const apiMethod = id ? Apis.system.user.editUser : Apis.system.user.addUser;
    await apiMethod(id ? { ...values, userId: id } : values);
    message.success(`${id ? "编辑" : "新增"}成功`);
    actionRef.current?.reload();
  };

  useEffect(() => {
    // 使用 setTimeout 来避免同步调用 setState
    const initializeData = async () => {
      try {
        await loadRoleList()
        
        const userInfo = storage.get("userInfo");
        if (userInfo) {
          let hasAdminRole = false;

          const roleArray = userInfo.roleList || userInfo.roles;

          // 如果有角色数组（多角色），检查是否包含管理员角色
          if (roleArray && Array.isArray(roleArray) && roleArray.length > 0) {
            hasAdminRole = roleArray.some((role: any) => {
              // 支持 roleId 和 id 两种字段名
              const id = role.roleId || role.id;
              return id === 1;
            });
          }
          // 如果只有单个 roleId（单角色）
          else if (userInfo.roleId) {
            hasAdminRole = userInfo.roleId === 1;
          }

          setIsAdmin(hasAdminRole);
        }
      } catch (error) {
        console.error('初始化数据失败:', error);
      }
    };

    initializeData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useListRefresh({
    key: EVENT_KEY.SYSTEM_USER_LIST_REFRESH,
    actionRef,
  });

  const columns: ProColumns[] = [
    {
      title: "账户",
      dataIndex: "email",
      align: "center",
      hideInSearch: false,
    },
    {
      title: "姓名",
      dataIndex: "realName",
      align: "center",
      hideInSearch: false,
    },
    {
      title: "角色",
      dataIndex: "roleId",
      align: "center",
      valueType: "select",
      hideInSearch: false,
      fieldProps: {
        showSearch: true,
        options: editRoleList,
        filterOption: (input: string, option: any) =>
          (option?.label ?? option?.text ?? "")
            .toLowerCase()
            .includes(input.toLowerCase()),
      },
      render: (_, record: any) => {
        if (
          record.roles &&
          Array.isArray(record.roles) &&
          record.roles.length > 0
        ) {
          return record.roles
            .map((role: any) => role.roleName || role.name)
            .join(", ");
        }
        if (record.roleId) {
          const role = editRoleList.find((r) => r.id === record.roleId);
          return role ? role.roleName : "-";
        }
        return "-";
      },
    },
    {
      title: "状态",
      dataIndex: "status",
      hideInForm: true,
      align: "center",
      valueEnum: StatusOptions,
      hideInSearch: false,
      initialValue: "1", // 默认选择启用状态
      render: (_, item) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Switch
            checkedChildren="开启"
            defaultChecked={item.status === 1}
            unCheckedChildren="关闭"
            onChange={() => {
              clickUpdateUserStatus(item.userId, item.status === 1 ? 0 : 1);
            }}
          />
        </div>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      align: "center",
      valueType: "index",
      hideInSearch: true,
      render: (_, item) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          {/* 添加此div */}
          {item.createdAt}
        </div>
      ),
    },
    {
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      align: "center",
      fixed: "right",
      width: isAdmin ? 160 : 80,
      render: (_, record) => (
        <Space>
          <Button
            key="edit"
            type="link"
            onClick={() => {
              userModelRef.current?.open(record, record.userId);
            }}
            size="small"
          >
            编辑
          </Button>
          {isAdmin && (
            <Button
              key="forceChangePassword"
              type="link"
              danger
              onClick={() => {
                handleForceChangePassword(record);
              }}
              size="small"
            >
              强制重置密码
            </Button>
          )}
        </Space>
      ),
    },
  ];
  return (
    <PageContent>
      <ProTable
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="userId"
        search={{
          labelWidth: "auto",
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              userModelRef.current?.open();
            }}
          >
            <PlusOutlined />
            新建
          </Button>,
        ]}
        // @ts-ignore
        request={(params) => {
          const requestParams: any = {
            page: params["current"],
            rows: params["pageSize"],
          };

          // 只添加非空的搜索条件
          if (params["email"])
            requestParams.emailLike = params["email"];
          if (params["realName"])
            requestParams.realNameLike = params["realName"];
          if (
            params["status"] !== undefined &&
            params["status"] !== null &&
            params["status"] !== ""
          ) {
            requestParams.status = params["status"];
          }
          if (params["mobilePhone"])
            requestParams.mobilePhoneLike = params["mobilePhone"];
          if (roleId || params["roleId"])
            requestParams.roleId = roleId || params["roleId"];

          return getUserList(requestParams);
        }}
        columns={columns}
        sticky={{
          offsetHeader: 0,
        }}
        scroll={{ x: 800 }}
      />

      <UserModel ref={userModelRef} onFinish={handleSave} />
      {contextHolder}
    </PageContent>
  );
};

export default OrgUser;

const StatusOptions = {
  "0": { text: "禁用" },
  "1": { text: "启用" },
};
