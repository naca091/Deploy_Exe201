import React, { useState, useEffect } from "react";
import { Calendar, Modal, Button, message } from "antd";
import dayjs from "dayjs";
import axios from "axios";

const AttendanceCalendar = ({ visible, onClose, onAttendanceSuccess }) => {
  const [attendanceDates, setAttendanceDates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      fetchAttendance();
    }
  }, [visible]);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://demcalo.onrender.com/api/attendance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setAttendanceDates(response.data.data.map((date) => dayjs(date)));
      }
    } catch (error) {
      message.error("Failed to fetch attendance records");
    }
  };

  const markAttendance = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://demcalo.onrender.com/api/attendance",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        message.success("Attendance marked successfully! +100 xu");
        fetchAttendance();
        onAttendanceSuccess(response.data.newBalance);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        message.warning("You have already marked attendance today");
      } else {
        message.error("Failed to mark attendance");
      }
    } finally {
      setLoading(false);
    }
  };

  const dateCellRender = (value) => {
    const isAttended = attendanceDates.some(
      (date) => date.format("YYYY-MM-DD") === value.format("YYYY-MM-DD")
    );

    if (isAttended) {
      return (
        <div className="h-full w-full flex items-center justify-center">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">✓</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      title="Attendance Calendar"
      width={800}
      footer={[
        <Button key="back" onClick={onClose}>
          Close
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={markAttendance}
          className="bg-blue-500"
        >
          Mark Attendance (+100 xu)
        </Button>,
      ]}
    >
      <Calendar
        fullscreen={false}
        cellRender={dateCellRender}
        className="attendance-calendar"
      />
    </Modal>
  );
};

export default AttendanceCalendar;
