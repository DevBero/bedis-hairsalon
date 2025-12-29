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
    <form className="mt-4 h-full mb-6 p-3 flex flex-col justify-end gap-6 overflow-x-hidden">
      <div className="flex flex-col gap-2 min-w-0 w-full">
        <Input
          type="time"
          id="start-time-picker"
          required
          defaultValue={start_time}
          onChange={(e) => setStart(e.target.value)}
          className="h-20 text-xl [&>svg]:hidden"
        />
      </div>
      <div className="flex flex-col gap-2 min-w-0 w-full">
        <Input
          type="time"
          id="end-time-picker"
          required
          defaultValue={end_time}
          onChange={(e) => setEnd(e.target.value)}
          className="h-20 text-xl [&>svg]:hidden"
        />
      </div>
    </form>
  );
};

export default TimesForm;
