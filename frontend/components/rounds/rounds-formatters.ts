export function formatMonthTitle(referenceDate: Date) {
  const formattedMonthTitle = referenceDate.toLocaleDateString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  return formattedMonthTitle.charAt(0).toUpperCase() + formattedMonthTitle.slice(1);
}

export function formatDateAndTime(referenceDate: Date) {
  return (
    referenceDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    }) + ` às ${formatTime(referenceDate)}`
  );
}

function formatTime(referenceDate: Date) {
  return referenceDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
