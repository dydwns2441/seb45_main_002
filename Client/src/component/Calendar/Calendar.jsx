import { styled } from "styled-components";
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import Modal from "../../atom/GlobalModal";
import "react-big-calendar/lib/css/react-big-calendar.css";
// import StyledCalendar from "../style/CalendarStyle";
import "moment/locale/ko";
import axios from "axios";

const CalendarContainer = styled.div`
  max-width: 768px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 1px solid red; */
  padding: 0;
`;

const DropdownButton = styled.button`
  width: 200px;
  height: 48px;
  border: 0.8px solid var(--festie-gray-600, #949494);
  border-radius: 10px;
  padding: 0px 12px;
  color: var(--festie-gray-800, #3a3a3a);
  font-family: SUIT Variable;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 140%;
  text-align: start;
  appearance: none;
  background-color: white;
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 12px;
`;

const CustomDot = styled.div`
  width: 9px;
  height: 8px;
  border-radius: 50%;
  background-color: #ffc123;
`;

const customToolbar = (toolbar) => {
  const goToPrev = () => {
    toolbar.onNavigate("PREV");
  };

  const goToNext = () => {
    toolbar.onNavigate("NEXT");
  };

  return (
    <div className="rbc-toolbar">
      {/* <span className="rbc-btn-group"></span> */}
      <span className="rbc-btn-group">
        <button type="button" onClick={goToPrev}>
          &lt; 이전 달
        </button>
        <span className="rbc-toolbar-label">{toolbar.label}</span>
        <button type="button" onClick={goToNext}>
          다음 달&gt;
        </button>
      </span>
    </div>
  );
};

// const eventData = [
//   {
//     start: new Date(2023, 8, 15),
//     end: new Date(2023, 8, 15),
//     hasDiet: true,
//     dietInfo: {
//       dailyMealId: 1,
//       memberId: 4,
//       date: "2023-09-05",
//       name: "식단명",
//       favorite: false,
//       eachMeals: [
//         "아침: 계란후라이, 토스트",
//         "점심: 김밥",
//         "저녁: 된장찌개, 밥",
//       ],
//       totalDailyKcal: 1000,
//       totalDailyCarbo: 500,
//       totalDailyProtein: 500,
//       totalDailyFat: 500,
//     },
//   },
// ];

const CustomCalendar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalHeader, setModalHeader] = useState(null);
  const [modalFooter, setModalFooter] = useState(null);
  const [eventData, setEventData] = useState([
    {
      start: new Date(2023, 8, 15),
      end: new Date(2023, 8, 15),
      hasDiet: true,
      dietInfo: {
        dailyMealId: 1,
        memberId: 4,
        date: "2023-09-05",
        name: "식단명",
        favorite: false,
        eachMeals: [
          "아침메뉴: 15일 아침",
          "점심: 15일 점심",
          "저녁: 15일 저녁 ",
        ],
        totalDailyKcal: 1000,
        totalDailyCarbo: 500,
        totalDailyProtein: 500,
        totalDailyFat: 500,
      },
    },
    {
      start: new Date(2023, 8, 18),
      end: new Date(2023, 8, 18),
      hasDiet: true,
      dietInfo: {
        dailyMealId: 2,
        memberId: 5,
        date: "2023-09-18",
        name: "식단명",
        favorite: false,
        eachMeals: [
          ["아침메뉴: 18일 아침"],
          ["점심: 18일 점심"],
          ["저녁: 18일 저녁"],
        ],
        totalDailyKcal: 1000,
        totalDailyCarbo: 500,
        totalDailyProtein: 500,
        totalDailyFat: 500,
      },
    },
    {
      start: new Date(2023, 11, 13),
      end: new Date(2023, 11, 13),
      hasDiet: true,
      dietInfo: {
        dailyMealId: 2,
        memberId: 5,
        date: "2023-11-13",
        name: "식단명",
        favorite: false,
        eachMeals: [
          ["아침메뉴: 12월13일 아침"],
          ["점심: 12월13일 점심 "],
          ["저녁: 12월13일 저녁"],
        ],
        totalDailyKcal: 1000,
        totalDailyCarbo: 500,
        totalDailyProtein: 500,
        totalDailyFat: 500,
      },
    },
  ]);
  useEffect(() => {
    axios
      .get("/api/")
      .then((response) => {
        const modifiedData = response.data.map((item) => {
          const [year, month, day] = item.date.split("-");
          const startDate = new Date(year, month - 1, day);
          const endDate = new Date(year, month - 1, day);
          const eachMealsArray = item.eachMeals.map((meal) => meal.eachMeal);
          return {
            start: startDate,
            end: endDate,
            hasDiet: true,
            dietInfo: item.eachMeals,
          };
        });
      })
      .catch((error) => {
        console.error("fetch error:", error);
      });
  }, []);

  const handleDateClick = (date, event) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const selectedEvents = eventData.filter((event) => {
      const start = moment(event.start).format("YYYY-MM-DD");
      const end = moment(event.end).format("YYYY-MM-DD");
      return start === formattedDate || end === formattedDate;
    });
    if (selectedEvents.length === 0) {
      const content = (
        <div>
          <ul>
            {selectedEvents.map((event, index) => (
              <li key={index}>{event.dietInfo.eachMeals}</li>
            ))}
          </ul>
        </div>
      );
      setModalContent(content);
      setIsModalOpen(true);
    }
  };

  const handleDotClick = (event) => {
    if (event.hasDiet) {
      setModalHeader(<h2>이 날 식단</h2>);
      setModalContent(<div>{event.dietInfo.eachMeals}</div>);
      setIsModalOpen(true);
    }
  };

  moment.locale("ko-KR");
  const localizer = momentLocalizer(moment);
  moment().format("YYYY-MM-DD HH:mm:ss");

  return (
    <CalendarContainer>
      <Calendar
        style={{ maxWidth: "768px", width: "90%", backgroundColor: "white" }}
        views={["month"]}
        localizer={localizer}
        events={eventData}
        startAccessor="start"
        endAccessor="end"
        handleEventClick={handleDotClick}
        onSelectEvent={handleDotClick}
        components={{
          event: ({ event }) => (event.hasDiet ? <CustomDot /> : null),
          toolbar: customToolbar,
        }}
        eventPropGetter={(event, isSelected) => {
          const backgroundColor = "white";
          return { style: { backgroundColor } };
        }}
      />
      <Modal
        isOpen={isModalOpen}
        content={modalContent}
        header={modalHeader}
        footer={modalFooter}
        setIsOpen={setIsModalOpen}
        setContent={setModalContent}
        setHeader={setModalHeader}
        setFooter={setModalFooter}
      />
    </CalendarContainer>
  );
};
export default CustomCalendar;