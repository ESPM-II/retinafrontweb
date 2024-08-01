
import React from 'react';
import {DatePicker, Form, Input, InputNumber, Select, Switch, TimePicker } from 'antd';
import ChileanRutify from 'chilean-rutify';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const CustomForm = ({ onFinish, form, fields }) => {

  const getInput = (field) => {
    if (field.type === 'select') {
      return (
        <Select
          showSearch
          allowClear
          mode={field.isMulti && "multiple"}
          style={{ width: '100%' }}
          placeholder={field.label}
          optionFilterProp="children"
          filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {field.options.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      );
    } else {
      return inputs[field.type];
    }
  };

  const validateRut = (value) => {
    if (! ChileanRutify.validRut(value) && value.length > 4) {
      return Promise.reject('Invalid Rut');
    } else {
      return Promise.resolve();
    }
  }

  const handleRutChange = (e) => {
    form.setFieldValue(e.target.id, ChileanRutify.formatRut(e.target.value))
}
  
  const inputs = {
    text: <Input style={{width: "100%"}}/>,
    email: <Input style={{width: "100%"}}/>,
    password: <Input.Password style={{width: "100%"}} visibilityToggle={false}/>,
    switch: <Switch style={{width: "100%"}} />,
    rut: <Input style={{width: "100%"}} onChange={handleRutChange} maxLength={12}/>,
    date: <DatePicker style={{width: "100%"}} format="DD-MM-YYYY"/>,
    time: <TimePicker style={{width: "100%"}} format='HH:mm'/>,
    dateRange: <RangePicker style={{width: "100%"}} />,
    number: <InputNumber style={{width: "100%"}} />,
    textarea: <TextArea style={{width: "100%"}} rows={4} />,
  };


  return (
    <Form
      className="flex flex-col w-full h-full gap-2 mt-10"
      form={form}
      onFinish={onFinish}
      labelCol={{
        flex: '110px',
      }}
      labelAlign="left"
      labelWrap
      wrapperCol={{
        flex: 1,
      }}
      style={{
        maxWidth: 600,
      }}
      layout="horizontal"
    >
      {fields.map((field, index) => (
        <Form.Item
          key={index}
          label={field.label}
          name={field.name}
          rules={[
            {
              required: field.required,
              type: field.type,
              ...(field.type === "rut" ? { validator: (_, value) => validateRut(value) } : {}),
              message: `El campo ${field.label} es requerido!`,
            },
          ]}
        >
          {getInput(field)}
        </Form.Item>
      ))}
    </Form>
  );
};

export default CustomForm;
