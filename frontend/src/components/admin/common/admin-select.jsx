import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";

export function AdminSelect({ options = [], placeholder = "Seçiniz", ...props }) {
  return (
    <NativeSelect {...props}>
      <NativeSelectOption value="">{placeholder}</NativeSelectOption>
      {options.map((option) => (
        <NativeSelectOption key={option.value} value={option.value}>
          {option.label}
        </NativeSelectOption>
      ))}
    </NativeSelect>
  );
}
