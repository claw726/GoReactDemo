import { BASE_URL } from '@/App';
import { Button, Flex, Input, Spinner } from '@chakra-ui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react'
import { IoMdAdd } from 'react-icons/io'

const TodoForm = () => {
  const [newTodo, setNewTodo] = useState("");

  const queryClient = useQueryClient();

  const{mutate:createTodo,isPending:isCreating} = useMutation({
    mutationKey:["createTodo"],
    mutationFn: async (e:React.FormEvent) => {
      e.preventDefault();
      try {
        const res = await fetch(`${BASE_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({Body: newTodo}),
      })
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not create todo.");
      }
      setNewTodo("");
      return data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new Error(`Error creating todo: ${error.message}`);
        }
        throw new Error("An unknown error occurred while creating todo.");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey:["todos"]});
    },
    onError: (error) => {
      alert(error.message);
      console.error("Error creating todo:", error);
    }
  })

  return (
    <form onSubmit = {createTodo}>
        <Flex gap={2}>
            <Input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} ref={(input) => input?.focus()}/>
            <Button mx={2} type='submit' _active={{transform: "scale(0.97)",}}>
                {isCreating ? <Spinner size={'xs'} /> : <IoMdAdd size={30} />}
            </Button>
        </Flex>
    </form>
  )
}

export default TodoForm

// STARTER CODE:
// import { Button, Flex, Input, Spinner } from '@chakra-ui/react'
// import React from 'react'
// import { IoMdAdd } from 'react-icons/io'

// const TodoForm = () => {
//   const [newTodo, setNewTodo] = useState("");
//   const [isPending, setIsPending] = useState(false);

//   const createTodo = async (e: React.FormEvent) => {
//     e.preventDefault();
//     alert("Todo Added");
//   }

//   return (
//     <form onSubmit = {createTodo}>
//         <Flex gap={2}>
//             <Input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} ref={(input) => input?.focus()}/>
//             <Button mx={2} type='submit' _active={{transform: "scale(0.97)",}}>
//                 {isPending ? <Spinner size={'xs'} /> : <IoMdAdd size={30} />}
//             </Button>
//         </Flex>
//     </form>
//   )
// }

// export default TodoForm