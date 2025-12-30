import {
  ProForm,
  ProFormText,
} from "@ant-design/pro-components";
import type { ProFormInstance } from "@ant-design/pro-components";
import { Card, Modal } from "antd";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

const RoleModel = forwardRef<
  { open: (values?: any, id?: number) => void },
  { onFinish: (values: any, id?: number) => void }
>(({ onFinish }, ref) => {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number>();
  const formRef = useRef<ProFormInstance>(null);

  const handleCancel = () => {
    formRef.current?.resetFields();
    setOpen(false);
    setEditId(undefined);
  };

  const handleOk = () => {
    return formRef.current
      ?.validateFields()
      .then((values) => onFinish(values, editId))
      .then(() => handleCancel());
  };

  useImperativeHandle(ref, () => ({
    open: (values?: any, id?: number) => {
      setEditId(id);
      setOpen(true);
      if (values) {
        setTimeout(() => formRef.current?.setFieldsValue(values), 0);
      }
    },
  }));

  return (
    <Modal
      title={editId ? "编辑角色" : "新增角色"}
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
            name="roleName"
            label="角色名称"
            required={true}
            rules={[{ required: true, message: "请输入角色名称" }]}
          />
          <ProFormText name="remark" label="备注" />
        </Card>
      </ProForm>
    </Modal>
  );
});

export default RoleModel;
