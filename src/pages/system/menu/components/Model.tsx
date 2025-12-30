import {
  ProForm,
  ProFormText,
  ProFormTreeSelect,
} from "@ant-design/pro-components";
import type { ProFormInstance } from "@ant-design/pro-components";
import { Card, Modal, Row, Col } from "antd";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import Apis from "@/apis";

const MenuModel = forwardRef<
  { open: (values?: any, id?: number) => void },
  { onFinish: (values: any, id?: number) => void }
>(({ onFinish }, ref) => {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number>();
  const formRef = useRef<ProFormInstance>(null);

  function enhanceMenuTree(tree: any[]): any[] {
    function recursiveEnhance(nodes: any[]): any[] {
      return nodes.map((node: any) => {
        // 为当前节点添加label和value字段
        const enhancedNode = {
          ...node,
          label: node.menuName,
          value: node.id,
        };

        // 如果当前节点有子节点，递归处理这些子节点
        if (node.children) {
          enhancedNode.children = recursiveEnhance(node.children);
        }

        return enhancedNode;
      });
    }

    return recursiveEnhance(tree);
  }

  const loadMenu = async () => {
    try {
      const res = await Apis.system.menu.getMenuTree({});
      const flatMenuTree = enhanceMenuTree(res.data);
      return flatMenuTree;
    } catch (error) {
      return [];
    }
  };

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
      title={editId ? "编辑菜单" : "新增菜单"}
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
            name="seq"
            label="排序"
            rules={[{ required: true, message: "请输入序号" }]}
          />

          <ProFormText
            name="menuName"
            label="菜单名称"
            rules={[{ required: true, message: "请输入菜单名称" }]}
          />

          <ProFormText
            name="src"
            label="菜单编码"
            rules={[{ required: true, message: "请输入菜单编码" }]}
          />

          <ProFormTreeSelect
            name={"parentId"}
            label="父级菜单"
            // @ts-ignore
            request={loadMenu}
            rules={[{ required: true, message: "请选择父级菜单" }]}
            fieldProps={{
              allowClear: true,
              placeholder: "请选择父级菜单",
              showSearch: true,
              treeNodeFilterProp: "label",
            }}
          />
        </Card>
      </ProForm>
    </Modal>
  );
});

export default MenuModel;
