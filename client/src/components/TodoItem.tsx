import { Badge, Flex, Text, Box, Spinner } from "@chakra-ui/react"
import { FaCheckCircle } from "react-icons/fa"
import { MdDelete } from "react-icons/md"
import type { Todo } from "./TodoList"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { BASE_URL } from "@/App"

const TodoItem = ({ todo }: {todo: Todo }) => {

    const queryClient = useQueryClient();

    const {mutate:updateTodo,isPending:isUpdating} = useMutation({
        mutationKey:["updateTodo"],
        mutationFn: async () => {
            if (todo.Completed) return alert("Already completed");
            try {
                const res = await fetch(`${BASE_URL}/todos/${todo.ID}`, {
                    method: "PATCH",
                })
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Could not update todo.");
                }
                return data;
            } catch (error) {
                console.error("Error updating todo:", error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:["todos"]});
        }
    });

    const { mutate:deleteTodo, isPending:isDeleting } = useMutation({
        mutationKey:["deleteTodo"],
        mutationFn: async () => {
            try {
                const res = await fetch(`${BASE_URL}/todos/${todo.ID}`, {
                    method: "DELETE",
                })
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Could not delete todo.");
                }
                return data;
            } catch (error) {
                console.error("Error deleting todo:", error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:["todos"]});
        }
    })



    return (
        <Flex gap={2} alignItems={"center"}>
            <Flex flex={1} alignItems={"center"} border={"1px"} borderColor={"gray.600"} p={2} borderRadius={"lg"} justifyContent={"space-between"}>
            <Text color={todo.Completed ? "green.200" : "yellow.100"} textDecoration={todo.Completed ? "line-through" : "none"}>
                {todo.Body}
            </Text>
            {todo.Completed && (
                <Badge ml='1' colorScheme='green'>
                    Done
                </Badge>
            )}
            {!todo.Completed && (
                <Badge ml='1' colorScheme='yellow'>
                    In Progress
                </Badge>
            )}
            </Flex>
            <Flex gap={2} alignItems={"center"}>
                <Box color={"green.500"} cursor={"pointer"}>
                    {!isUpdating && <FaCheckCircle size={20} onClick={() => updateTodo()} />}
                    {isUpdating && <Spinner size={"sm"} />}
                </Box>
                <Box color={"red.500"} cursor={"pointer"} onClick={() => deleteTodo()}>
                    {!isDeleting && <MdDelete size={25} />}
                    {isDeleting && <Spinner size={"sm"} />}
                </Box>
            </Flex>
        </Flex>
    )
}
export default TodoItem;

// STARTER CODE:

// import { Badge, Flex, Text, Box } from "@chakra-ui/react"
// import { FaCheckCircle } from "react-icons/fa"
// import { MdDelete } from "react-icons/md"

// const TodoItem = ({ todo }: {todo: { _id: number, body: string, completed: boolean } }) => {
//     return (
//         <Flex gap={2} alignItems={"center"}>
//             <Flex flex={1} alignItems={"center"} border={"1px"} borderColor={"gray.600"} p={2} borderRadius={"lg"} justifyContent={"space-between"}>
//             <Text color={todo.completed ? "green.200" : "yellow.100"} textDecoration={todo.completed ? "line-through" : "none"}>
//                 {todo.body}
//             </Text>
//             {todo.completed && (
//                 <Badge ml='1' colorScheme='green'>
//                     Done
//                 </Badge>
//             )}
//             {!todo.completed && (
//                 <Badge ml='1' colorScheme='yellow'>
//                     In Progress
//                 </Badge>
//             )}
//             </Flex>
//             <Flex gap={2} alignItems={"center"}>
//                 <Box color={"green.500"} cursor={"pointer"}>
//                     <FaCheckCircle size={20} />
//                 </Box>
//                 <Box color={"red.500"} cursor={"pointer"}>
//                     <MdDelete size={25} />
//                 </Box>
//             </Flex>
//         </Flex>
//     )
// }
// export default TodoItem;