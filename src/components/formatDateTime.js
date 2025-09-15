import React from "react";
import moment from "moment";

const FormatDateTime = ({ date }) => {
  return <span>{moment(date).format("MMMM Do YYYY, h:mm:ss a")}</span>;
};

export default FormatDateTime;

export const formatdate = (isoTimestamp) => {
  const date = new Date(isoTimestamp);

  const year = date.getUTCFullYear();
  const month = date.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
  const day = date.getUTCDate();

  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');

  const amOrPm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  return `${month} ${day}, ${year}, at ${hours}:${minutes}:${seconds} ${amOrPm}`;
}

export const dateformat = (isoTimestamp) => {
  const date = new Date(isoTimestamp);

  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear().toString().slice(-2);

  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');

  const amOrPm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  return `${day}/${month}/${year}-${hours}:${minutes} ${amOrPm}`;
};

