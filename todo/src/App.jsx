import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Container, Box, Typography, Snackbar, Alert } from "@mui/material";
import { useState, useEffect } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

function App() {
    const [todos, setTodos] = useState([]);
    const [priority, setPriority] = useState("medium");
    const [inputValue, setInputValue] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false); // 스넥바 오픈 상태
    const [snackbarMessage, setSnackbarMessage] = useState(""); // 스넥바에 표시할 메시지

    useEffect(() => {
        fetch("/src/assets/data.json")
            .then((response) => response.json())
            .then((data) => setTodos(data))
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handlePriorityChange = (e) => {
        setPriority(e.target.value);
    };

    const handleAddTodo = () => {
        if (inputValue.trim()) {
            const newTodo = {
                task: inputValue,
                priority: priority,
                isDone: false,
            };
            setTodos([...todos, newTodo]);
            setInputValue("");

            // 스넥바 상태 업데이트
            setSnackbarMessage(`"${newTodo.task}" added!`);
            setSnackbarOpen(true);
        }
    };

    const handleToggleTodo = (index) => {
        setTodos(
            todos.map((todo, i) =>
                i === index ? { ...todo, isDone: !todo.isDone } : todo
            )
        );
    };

    // 스넥바 자동 닫기
    useEffect(() => {
        if (snackbarOpen) {
            const timer = setTimeout(() => {
                setSnackbarOpen(false);
            }, 3000); // 3초 후에 스넥바 닫기
            return () => clearTimeout(timer); // 컴포넌트가 unmount되면 타이머 정리
        }
    }, [snackbarOpen]);

    return (
            <Box
                sx={{
                    minHeight: "100vh",
                    width: "100vw",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Container
                    maxWidth="md"
                    sx={{
                        py: 4,
                        width: "60%",
                        minWidth: "800px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        margin: "0 auto",
                    }}
                >
                    <Typography
                        variant="h4"
                        component="h1"
                        gutterBottom
                        align="center"
                        fontWeight="bold"
                    >
                        NEXT Todo App
                    </Typography>
                    <TodoForm
                        inputValue={inputValue}
                        handleInputChange={handleInputChange}
                        handleAddTodo={handleAddTodo}
                        handlePriorityChange={handlePriorityChange}
                        priority={priority}
                    />
                    <TodoList
                        todos={todos}
                        handleToggleTodo={handleToggleTodo}
                    />

                    {/* Snackbar */}
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={3000}
                        onClose={() => setSnackbarOpen(false)}
                    >
                        <Alert
                            onClose={() => setSnackbarOpen(false)}
                            severity="success"
                            sx={{ width: "100%" }}
                        >
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </Container>
            </Box>
    );
}

export default App;
