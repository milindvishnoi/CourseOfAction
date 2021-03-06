import { Container, Button, Typography, Box, Grid } from "@mui/material";
import { Assessment, CourseInterface } from "../store/courses";
import {
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@mui/system";
import { useNavigate } from "react-router-dom";
import moment from "moment";

interface propTypes {
  courses: CourseInterface[];
}

const CustomPieTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#ffff",
          padding: "5px",
          border: "1px solid #cccc",
          color: "black",
        }}
      >
        <label>{`${payload[0].value}% ${payload[0].name} `}</label>
      </div>
    );
  }

  return null;
};

function Dashboard({ courses }: propTypes) {
  const theme = useTheme();
  const navigate = useNavigate();
  if (courses.length === 0) {
    return (
      <Container>
        <Typography variant="h1" color="primary.main">
          Dashboard
        </Typography>
        <br></br>
        <Typography variant="h6" color="primary.secondary">
          Click "Add Courses" to update your semester so you can see cool
          visuals regarding your progress.
        </Typography>
      </Container>
    );
  }
  //use this function to find percent left data for the completion chart
  const calculateGradeData = () => {
    let currentWeight: number = 0;
    let percentLeft: number = 100 * courses.length;
    courses.forEach((course) => {
      course.assessments.forEach((assessment) => {
        const { weight, mark } = assessment;
        if (mark !== -1 && mark !== null) {
          currentWeight += weight;
        }
      });
    });
    return [
      {
        name: "Completed",
        value: +(currentWeight / courses.length).toFixed(2),
      },
      {
        name: "Left",
        value: +((percentLeft - currentWeight) / courses.length).toFixed(2),
      },
    ];
  };
  let data = calculateGradeData();
  const COLORS = ["#00C49F", theme.palette.primary.main];

  const getDeadlines = () => {
    let deadlines: Assessment[] = [];
    courses.forEach((course) => {
      course.assessments.forEach((assessment) => {
        if (assessment.deadline !== undefined) {
          deadlines.push(assessment);
        }
      });
    });
    deadlines.sort(function (a, b) {
      return +new Date(a.deadline) - +new Date(b.deadline);
    });
    const today = moment();
    let deadlineDisplay = deadlines
      .filter((a) => moment(a.deadline) >= today)
      .map((a) => {
        return (
          <Typography ml={3} key={a.name}>
            {a.name} - {new Date(a.deadline).toDateString()}
          </Typography>
        );
      });

    deadlineDisplay =
      deadlineDisplay.length > 5
        ? deadlineDisplay.splice(0, 5)
        : deadlineDisplay;

    return deadlineDisplay.length > 0 ? (
      deadlineDisplay
    ) : (
      <Typography ml={3}>No upcoming deadlines!</Typography>
    );
  };

  return (
    <Container>
      <Typography variant="h1" color="primary.main">
        Dashboard
      </Typography>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} lg={6} sx={{ height: "300px" }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  ></Cell>
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} lg={6} sx={{ width: "100%", height: "292px" }}>
          <ResponsiveContainer>
            <BarChart height={200} data={courses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={"code"} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar
                dataKey={"currMark"}
                fill={COLORS[0]}
                name="Current Percentage"
                unit="%"
              />
              <Bar
                dataKey={"expectedMark"}
                fill={COLORS[1]}
                name="Expected Percentage"
                unit="%"
              />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              backgroundColor: "navBackgorund.secondary",
              borderRadius: "18px",
              marginY: 5,
            }}
            p={3}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
              pb={2}
            >
              <Typography variant="h5">Next Deadline</Typography>
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ ml: 2, color: "white" }}
                onClick={() => navigate("/upcoming")}
              >
                More
              </Button>
            </Box>
            <Box>{getDeadlines()}</Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
