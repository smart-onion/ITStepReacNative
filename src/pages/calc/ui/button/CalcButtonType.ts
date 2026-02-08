const CalcButtonType = {
  digit: 'digit',
  operation: 'operation',
  equal: 'equal',
  disabled: "disabled",
  memory: "memory",
} as const;

type CalcButtonType = (typeof CalcButtonType)[keyof typeof CalcButtonType];

export default CalcButtonType;