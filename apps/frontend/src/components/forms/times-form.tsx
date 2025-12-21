import { Input } from "../ui/input";

type TimesFormProps = {
  start_time: string;
  end_time: string;
  setStart: (value: string) => void;
  setEnd: (value: string) => void;
};

const TimesForm = ({
  start_time,
  end_time,
  setStart,
  setEnd,
}: TimesFormProps) => {
  return (
    <form className="mt-4 h-full justify-end flex mb-4 items-end p-3 gap-6">
      <Input
        type="time"
        id="start-time-picker"
        required
        defaultValue={start_time}
        onChange={(e) => setStart(e.target.value)}
        className="h-20 text-xl [&>svg]:hidden"
      />
      <Input
        type="time"
        id="end-time-picker"
        required
        defaultValue={end_time}
        onChange={(e) => setEnd(e.target.value)}
        className="h-20 text-xl [&>svg]:hidden"
      />
    </form>
  );
};

export default TimesForm;
