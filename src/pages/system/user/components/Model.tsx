import { ProForm, ProFormSelect, ProFormText } from "@ant-design/pro-components";
import type { ProFormInstance } from "@ant-design/pro-components";
import { Card, Modal } from "antd";
import { forwardRef, useImperativeHandle, useRef, useState, useCallback, useEffect } from "react";
import Apis from '@/apis';

const UserModel = forwardRef<
  { open: (values?: any, id?: number) => void },
  { onFinish: (values: any, id?: number) => void }
>(({ onFinish }, ref) => {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number>();
  const [roleList, setRoleList] = useState<any[]>([]);
  const formRef = useRef<ProFormInstance>(null);
  const [id, setId] = useState<number>();

  /**
   * 拿角色列表
   */
  const loadRoleList = useCallback(async () => {
    const res = await Apis.system.user.getRoleList()as any;
    
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
          id,
          roleIds: roleId && Array.isArray(roleId) ? roleId : [],
        };

        return onFinish(submitData, editId);
      })
      .then(() => handleCancel());
  };

  useImperativeHandle(ref, () => ({
    open: (values?: any, id?: number) => {
      setEditId(id);
      setOpen(true);
      if (values) {
        setTimeout(() => {
          // 处理编辑时的数据回填
          const formValues = { ...values };
          if (values.roles && Array.isArray(values.roles)) {
            formValues.roleId = values.roles.map((role: any) => role.roleId || role.id);
          }
          formRef.current?.setFieldsValue(formValues);
          setId(values.id);
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
            name="email"
            label="账户"
            required
            rules={[
              { required: true, message: '请输入邮箱地址' },
              ...(editId ? [] : [{
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: '请输入正确的邮箱格式'
              }])
            ]}
            disabled={!!editId} // 编辑时禁用账户名修改
          />
          <ProFormText
            name="realName"
            label="姓名"
            required
            rules={[{ required: true, message: '请输入姓名' }]}
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
                name="pwd"
                label="密码"
                required
                rules={[
                  {
                    required: true,
                    message: '密码为必填项',
                  },
                  {
                    pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,18}$/,
                    message: '密码长度为6-18位,必须由字母、数字、特殊字符组成',
                  },
                ]}
              />
              <ProFormText.Password
                name="confirmPwd"
                label="确认密码"
                required
                rules={[
                  {
                    required: true,
                    message: '确认密码为必填项',
                  },
                  ({ getFieldValue }) => ({
                    validator(_: any, value: any) {
                      if (!value || getFieldValue('pwd') === value) {
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
