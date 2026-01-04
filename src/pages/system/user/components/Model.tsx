import { ProForm, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import type { ProFormInstance } from "@ant-design/pro-components";
import { Card, Modal } from "antd";
import { forwardRef, useImperativeHandle, useRef, useState, useCallback, useEffect } from "react";
import Apis from '@/apis';

const UserModel = forwardRef<
  { open: (values?: any, id?: string) => void },
  { onFinish: (values: any, id?: string) => void }
>(({ onFinish }, ref) => {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string>();
  const [roleList, setRoleList] = useState<any[]>([]);
  const formRef = useRef<ProFormInstance>(null);

  /**
   * 拿角色列表
   */
  const loadRoleList = useCallback(async () => {
    const res = await Apis.system.user.getRoleList() as any;

    const roleList = (res || []).map((item: any) => {
      return {
        ...item,
        label: item.roleName,
        value: item.id,
      };
    });
    setRoleList(roleList);
  }, []);

  useEffect(() => {
    if (open) {
      loadRoleList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleCancel = () => {
    formRef.current?.resetFields();
    setOpen(false);
    setEditId(undefined);
  };

  const handleOk = () => {
    return formRef.current?.validateFields()
      .then(values => {

        const { roleId, ...restValues } = values;

        const filteredValues = Object.keys(restValues).reduce((acc: any, key) => {
          const value = restValues[key];
          if (value !== '' && value !== null && value !== undefined) {
            acc[key] = value;
          }
          return acc;
        }, {});

        const submitData = {
          ...filteredValues,
          id: editId,
          roleIds: roleId && Array.isArray(roleId) ? roleId : [],
        };

        return onFinish(submitData, editId);
      })
      .then(() => handleCancel());
  };

  useImperativeHandle(ref, () => ({
    open: (values?: any, id?: string) => {
      setEditId(id);
      setOpen(true);
      if (values) {
        setTimeout(() => {
          // 处理编辑时的数据回填
          const formValues = { ...values };
          if (values.roles && Array.isArray(values.roles)) {
            formValues.roleId = values.roles.map((role: any) => role.id);
          }
          formRef.current?.setFieldsValue(formValues);
        }, 0);
      }
    }
  }));

  return (
    <Modal
      title={editId ? '编辑用户' : '新增用户'}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
    >
      <ProForm
        submitter={false}
        scrollToFirstError
        formRef={formRef}
        layout="vertical"
      >
        <Card>
          <ProFormText
            name="username"
            label="用户名"
            required
            rules={[
              { required: true, message: '请输入用户名' },
            ]}
            disabled={!!editId}
          />
          <ProFormText
            name="nickname"
            label="昵称"
            required
            rules={[{ required: true, message: '请输入昵称' }]}
          />
          <ProFormSelect
            name="roleId"
            label="角色"
            required
            rules={[{ required: true, message: '请选择角色' }]}
            fieldProps={{
              mode: 'multiple',
            }}
            options={roleList}
            showSearch
          />
          {!editId && (
            <>
              <ProFormText.Password
                name="password"
                label="密码"
                required
                rules={[
                  {
                    required: true,
                    message: '密码为必填项',
                  },
                  {
                    min: 6,
                    message: '密码长度至少6位',
                  },
                ]}
              />
              <ProFormText.Password
                name="confirmPassword"
                label="确认密码"
                required
                rules={[
                  {
                    required: true,
                    message: '确认密码为必填项',
                  },
                  ({ getFieldValue }) => ({
                    validator(_: any, value: any) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次密码不一致'));
                    },
                  }),
                ]}
              />
            </>
          )}
        </Card>
      </ProForm>
    </Modal>
  );
});

export default UserModel;
