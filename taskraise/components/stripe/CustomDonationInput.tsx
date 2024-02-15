import { formatAmountForDisplay } from "@/utils/stripe-helpers";
import { Input } from "../ui/input";

export default function CustomDonationInput({
  name,
  min,
  max,
  currency,
  step,
  onChange,
  value,
  className,
}: {
  name: string;
  min: number;
  max: number;
  currency: string;
  step: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: number;
  className?: string;
}): JSX.Element {
  return (
    <label>
      Custom donation amount ({formatAmountForDisplay(min, currency)}-
      {formatAmountForDisplay(max, currency)}):
      <Input
        type="range"
        name={name}
        min={min}
        max={max}
        step={step}
        onChange={onChange}
        value={value}
      ></Input>
    </label>
  );
}
