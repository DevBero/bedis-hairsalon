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
    <form className="mt-4 h-full mb-4 p-3 flex items-end gap-6 w-full overflow-x-hidden">
      <div className="flex flex-col flex-1 gap-2 min-w-0">
        <span>VON</span>
        <Input
          type="time"
          id="start-time-picker"
          required
          defaultValue={start_time}
          onChange={(e) => setStart(e.target.value)}
          className="h-20 text-xl [&>svg]:hidden w-full"
        />
      </div>
      <div className="flex flex-col flex-1 gap-2 min-w-0">
        <span>BIS</span>
        <Input
          type="time"
          id="end-time-picker"
          required
          defaultValue={end_time}
          onChange={(e) => setEnd(e.target.value)}
          className="h-20 text-xl [&>svg]:hidden w-full"
        />
      </div>
    </form>
  );
};

export default TimesForm;
