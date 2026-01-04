import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { ProTable } from "@ant-design/pro-components";
import { Button, Space, Switch } from "antd";
import Apis from "@/apis";
import { PageContent } from "@/components/base";
import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { useListRefresh } from "@/hooks";
import { EVENT_KEY } from "@/constants";
import UserModel from "./components/Model";
import message from "@/utils/message";

const OrgUser: React.FC = () => {
  const [searchParams] = useSearchParams();
  const roleId = searchParams.get("roleId");

  const actionRef = useRef<ActionType>(null);
  const userModelRef = useRef<{ open: (values?: any, id?: string) => void }>(
    null
  );
  const [editRoleList, setEditRoleList] = useState<any[]>([]);

  /**
   * 拿角色列表
   */
  const loadRoleList = useCallback(async () => {
    const res = await Apis.system.user.getRoleList() as any;

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
    const res = await Apis.system.user.getUserList(params) as any;
    return {
      data: res.rows,
      success: true,
      total: res.total,
    };
  };

  const clickUpdateUserStatus = async (id: string, status: number) => {
    try {
      await Apis.system.user.changeUserStatus({
        id,
        status,
      });
      message.success("操作成功");
      actionRef.current?.reload();
    } catch (e) {
      console.log(e)
    }
  };

  const handleSave = async (values: any, id?: string) => {
    const apiMethod = id ? Apis.system.user.editUser : Apis.system.user.addUser;
    await apiMethod(values);
    message.success(`${id ? "编辑" : "新增"}成功`);
    actionRef.current?.reload();
  };

  useEffect(() => {
    loadRoleList();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useListRefresh({
    key: EVENT_KEY.SYSTEM_USER_LIST_REFRESH,
    actionRef,
  });

  const columns: ProColumns[] = [
    {
      title: "用户名",
      dataIndex: "username",
      align: "center",
      hideInSearch: false,
    },
    {
      title: "昵称",
      dataIndex: "nickname",
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
      initialValue: "1",
      render: (_, item) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Switch
            checkedChildren="开启"
            checked={item.status === 1}
            unCheckedChildren="关闭"
            onChange={() => {
              clickUpdateUserStatus(item.id, item.status === 1 ? 0 : 1);
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
      width: 80,
      render: (_, record) => (
        <Space>
          <Button
            key="edit"
            type="link"
            onClick={() => {
              userModelRef.current?.open(record, record.id);
            }}
            size="small"
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <PageContent>
      <ProTable
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="id"
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

          if (params["username"])
            requestParams.username = params["username"];
          if (params["nickname"])
            requestParams.nickname = params["nickname"];
          if (
            params["status"] !== undefined &&
            params["status"] !== null &&
            params["status"] !== ""
          ) {
            requestParams.status = params["status"];
          }
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
    </PageContent>
  );
};

export default OrgUser;

const StatusOptions = {
  "0": { text: "禁用" },
  "1": { text: "启用" },
};
