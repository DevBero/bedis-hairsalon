"use client";

import PageWrapper from "@/components/layout/page-wrapper";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { CalendarPlus, Repeat } from "lucide-react";
import Link from "next/link";

const SubmitBookingPage = () => {
  const searchParams = useSearchParams();

  const date = searchParams.get("date");
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const title = searchParams.get("title") ?? " ";

  const handleAddToCalendar = useCallback(() => {
    if (!date || !start || !end) {
      alert("Kalenderdaten fehlen. Bitte Termin manuell eintragen.");
      return;
    }

    const startDateTime = new Date(`${date}T${start}:00`);
    const endDateTime = new Date(`${date}T${end}:00`);

    const formatICSDate = (d: Date) => {
      const pad = (n: number) => String(n).padStart(2, "0");
      const year = d.getUTCFullYear();
      const month = pad(d.getUTCMonth() + 1);
      const day = pad(d.getUTCDate());
      const hours = pad(d.getUTCHours());
      const minutes = pad(d.getUTCMinutes());
      const seconds = pad(d.getUTCSeconds());
      return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    };

    const dtStart = formatICSDate(startDateTime);
    const dtEnd = formatICSDate(endDateTime);
    const dtStamp = formatICSDate(new Date());

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Bedis_Hairsalon//Terminbuchung//DE",
      "BEGIN:VEVENT",
      `UID:${dtStamp}@simplict`,
      `DTSTAMP:${dtStamp}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY: Termin bei Bedi`,
      "DESCRIPTION:Gebuchter Termin",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "termin.ics";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [date, start, end]);

  return (
    <PageWrapper className="flex flex-col items-center justify-center text-center">
      <div>
        <h1 className="text-3xl">
          Danke für deine Buchung <br />{" "}
          <strong className="text-blue-600">{title}.</strong>
        </h1>
        <p className="mt-4 px-2 text-gray-600">
          Falls du deinen Termin doch kurzfristig absagen musst, ruf mich bitte
          an oder schreib mir eine Whatsapp Nachricht.
        </p>
      </div>

      <Button size="lg" className="gap-4 mt-8" onClick={handleAddToCalendar}>
        <CalendarPlus />
        Zum Kalender hinzufügen
      </Button>
      <Link className="underline mt-3 flex items-center gap-2" href={"/"}>
        <Repeat size={16} />
        Erneut buchen
      </Link>
    </PageWrapper>
  );
};

export default SubmitBookingPage;
