import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import Select from 'react-select';
import { ConditionalWrapper } from '../../utils/ConditionalWrapper';

export const FormGroup = ({
  type,
  prepend,
  append,
  isMulti,
  options,
  name,
  label,
  control,
  rules,
  placeholder,
  errors,
  dirtyFields,
  text,
  autoComplete,
  disabled,
  showValid,
}) => {
  return (
    <Form.Group className="mb-3">
      {label !== 'none' && <Form.Label>{label ? label : name}</Form.Label>}
      <ConditionalWrapper
        condition={prepend || append}
        wrapper={(children) => <InputGroup>{children}</InputGroup>}
      >
        {prepend && <InputGroup.Text>{prepend}</InputGroup.Text>}
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field }) => {
            switch (type) {
              case 'select':
                return (
                  <Select
                    {...field}
                    options={options}
                    isMulti={isMulti}
                    styles={{
                      control: (control) => ({
                        ...control,
                        borderColor:
                          errors[name] || dirtyFields[name]
                            ? !errors[name]
                              ? '#198754'
                              : '#dc3545'
                            : control.borderColor,
                      }),
                    }}
                  />
                );
              default:
                return (
                  <Form.Control
                    {...field}
                    type={type}
                    disabled={disabled}
                    placeholder={placeholder}
                    autoComplete={autoComplete || 'off'}
                    isInvalid={errors[name]}
                    isValid={
                      showValid === 'true' && dirtyFields[name] && !errors[name]
                    }
                  />
                );
            }
          }}
        />
        {append && <InputGroup.Text>{append}</InputGroup.Text>}
      </ConditionalWrapper>
      <Form.Text
        className={errors && errors[name] ? 'text-danger' : 'text-muted'}
      >
        {errors && errors[name] ? errors[name]?.message : text}
      </Form.Text>
    </Form.Group>
  );
};
