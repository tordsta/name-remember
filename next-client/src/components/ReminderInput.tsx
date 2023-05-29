import React, { useState } from "react";
import Button, { FramedButton } from "./style/Button";
import { Frequency, RRule, datetime } from "rrule";
import { notifyError, notifyWarning } from "./Notify";
import Modal from "./Modal";

export default function ReminderInput() {
  const [openSignal, setOpenSignal] = useState(false);
  const [frequency, setFrequency] = useState<Frequency>(RRule.WEEKLY);
  const [interval, setInterval] = useState<number>(1);
  const [dtstart, setDtstart] = useState<Date>(
    datetime(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDay()
    )
  );
  const [days, setDays] = useState<Array<number>>([]);
  const [hours, setHours] = useState<Array<number>>([]);
  const dayNames = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const hourNames = ["Morning", "Midday", "Afternoon", "Evening"];
  const [rruleText, setRruleText] = useState<string | null>(null);

  const handleFrequencyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const val = parseInt(event.target.value);
    if (val !== 0 && val !== 1 && val !== 2 && val !== 3) {
      notifyError("Please select a valid frequency");
      return;
    }
    setFrequency(val);
  };

  const handleIntervalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(event.target.value);
    if (!isNaN(val) && val > 0) {
      setInterval(val);
    }
  };

  const handleDayChange =
    (day: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        setDays([...days, day]);
      } else {
        setDays(days.filter((d) => d !== day));
      }
    };

  const handleHoursChange =
    (hour: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        setHours([...hours, hour]);
      } else {
        setHours(hours.filter((h) => h !== hour));
      }
    };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    //TODO - check if valid input
    if (interval == null || interval == 0) {
      console.log("invalid input", frequency, interval);
      return;
    }
    // else {
    //     notifyWarning("Please enter a positive number over 0");
    //   }

    let byHours: Array<number> = [];
    if (hours.includes(0)) byHours.push(7);
    if (hours.includes(1)) byHours.push(11);
    if (hours.includes(2)) byHours.push(15);
    if (hours.includes(3)) byHours.push(19);

    const rrule = new RRule({
      freq: frequency,
      interval: interval,
      dtstart: dtstart,
      byweekday: days.length > 0 ? days : null,
      byhour: byHours.length > 0 ? byHours : null,
    });

    console.log("rrule", rrule.toString());
    setRruleText(rrule.toText());

    //TODO handle timezones
    let date = new Date();
    for (let i = 0; i <= 10; i++) {
      console.log(date, i);
      let dateOrNull = rrule.after(date);
      if (dateOrNull) {
        date = dateOrNull;
      } else {
        console.log("no date");
        break;
      }
    }
  };

  //TODO implement select date on year. And select 1-31 date on month. Premium feature?
  return (
    <>
      <div className="flex flex-col gap-4 justify-center items-center min-w-[250px]">
        <div className="flex flex-col items-center justify-center">
          <p className=" text-xl">Reminder Settings</p>
          {rruleText && <p className="w-[250px] text-center">{rruleText}</p>}
        </div>

        <FramedButton
          onClick={() => {
            setOpenSignal(true);
            setHours([]);
            setDays([]);
            setFrequency(RRule.WEEKLY);
            setInterval(1);
          }}
        >
          Edit Reminder
        </FramedButton>
      </div>
      <Modal openSignal={openSignal} setOpenSignal={setOpenSignal}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-4"
        >
          <p className="text-xl">Edit reminder</p>
          <div className="flex flex-col items-center justify-center">
            <div className="flex justify-center items-center gap-2 m-2">
              <p>On a </p>
              <select
                onChange={handleFrequencyChange}
                defaultValue={RRule.WEEKLY}
                className="border border-black rounded mx-1 px-1 w-20"
              >
                <option value={RRule.YEARLY}>Yearly</option>
                <option value={RRule.MONTHLY}>Monthly</option>
                <option value={RRule.WEEKLY}>Weekly</option>
                <option value={RRule.DAILY}>Daily</option>
              </select>
              <p>basis. </p>
              <label htmlFor="interval">
                {interval == 1 ? <>Every</> : <> Skip every</>}
                {frequency == 0 && interval == 1 && <> year</>}
                {frequency == 1 && interval == 1 && <> month</>}
                {frequency == 2 && interval == 1 && <> week</>}
                {frequency == 3 && interval == 1 && <> day</>}
              </label>
              <input
                className="border border-black rounded-sm w-8 px-1"
                type="numeric"
                min="1"
                step="1"
                defaultValue={1}
                onChange={handleIntervalChange}
              />
              {frequency == 0 && interval != 1 && <p>years</p>}
              {frequency == 1 && interval != 1 && <p>months</p>}
              {frequency == 2 && interval != 1 && <p>weeks</p>}
              {frequency == 3 && interval != 1 && <p>days</p>}
            </div>
            {frequency == 2 && (
              <>
                <p className="mt-6">Include these days:</p>
                <div className="flex flex-wrap max-w-sm gap-2 justify-center items-center py-2">
                  {dayNames.map((day, index) => (
                    <div key={index} className="ml-1">
                      <input
                        className="mx-2"
                        type="checkbox"
                        id={day}
                        onChange={handleDayChange(index)}
                      />
                      <label htmlFor={day}>{day}</label>
                    </div>
                  ))}
                </div>
              </>
            )}
            <p className="mt-6">Include these times:</p>
            <div className="flex flex-wrap max-w-sm gap-2 justify-center items-center py-2">
              {hourNames.map((time, index) => (
                <div key={index} className="ml-1">
                  <input
                    className="mx-2"
                    type="checkbox"
                    id={time}
                    onChange={handleHoursChange(index)}
                  />
                  <label htmlFor={time}>{time}</label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center items-center gap-2 mb-4 md:mt-4">
            <Button
              style={"cancel"}
              onClick={() => {
                setOpenSignal(false);
              }}
            />
            <Button style="submit" typeSubmit={true} />
          </div>
        </form>
      </Modal>
    </>
  );
}
