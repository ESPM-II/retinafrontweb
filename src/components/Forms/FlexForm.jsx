
import React from 'react';
import {DatePicker, Form, Input, InputNumber, Select, Switch, TimePicker } from 'antd';
import ChileanRutify from 'chilean-rutify';

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const FlexForm = ({ onFinish, form, fields }) => {

  const getInput = (field, props = {}) => {
    if (field.type === 'select') {
      return (
        <Select
          {...props}
          showSearch
          allowClear
          style={{ width: '100%' }}
          placeholder={field.label}
          optionFilterProp="children"
          filterOption={(input, option) => option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {field.options?.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      );
    } else {
      return getInputs(field.type, props);
    }
  };

  const handleRutChange = (e) => {
    form.setFieldValue(e.target.id, ChileanRutify.formatRut(e.target.value))
  }

  const validateRut = (value) => {
    if (! ChileanRutify.validRut(value) && value.length > 4) {
      return Promise.reject('Invalid Rut');
    } else {
      return Promise.resolve();
    }
  }
  
  
  const getInputs = (type, props = {}) => {
    const items = {
      text: <Input {...props}/>,
      email: <Input {...props}/>,
      password: <Input.Password visibilityToggle={false} {...props}/>,
      switch: <Switch {...props}/>,
      rut: <Input onChange={handleRutChange} maxLength={12} {...props}/>,
      date: <DatePicker format="DD-MM-YYYY" {...props} style={{ width: "100%" }}/>,
      time: <TimePicker format='HH:mm' {...props}/>,
      dateRange: <RangePicker format="DD-MM-YYYY" {...props}/>,
      number: <InputNumber {...props} style={{ width: "100%" }}/>,
      textarea: <TextArea rows={4} {...props}/>,
    };
    return items[type];
  };


  return (
    <Form
      className="grid w-full h-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
      form={form}
      onFinish={onFinish}
      layout='vertical'
    >
      {fields.map((field, index) => {
        const {label, tooltip, name, required, type, ...props} = field;
        return (
          <Form.Item
            className='p-1 min-w-64'
            labelCol={{
              span: 24
            }}
            wrapperCol={{
              span: 24
            }}
            key={index}
            label={label}
            tooltip={tooltip || false}
            name={name}
            rules={[
              {
                required: required,
                type: type,
                // validator: (_, value) => type === "rut" ? validateRut(value) : {} ,
                ...(type === "rut" ? { validator: (_, value) => validateRut(value) } : {}),
                message: `El campo ${label} es requerido!`,
              },
            ]}
          >
            {getInput(field, props)}
          </Form.Item>
        )
      })}
    </Form>
  );
};

export default FlexForm;
