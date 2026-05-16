import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

function App() {

  const queryClient = useQueryClient()

  // FETCH USERS
  const fetchUsers = async () => {
    const res = await fetch(
      'https://jsonplaceholder.typicode.com/users'
    )
    return res.json()
  }

  // QUERY
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 5000,
  })

  // MUTATION
  const mutation = useMutation({
    mutationFn: async (newUser) => {
      const res = await fetch(
        'https://jsonplaceholder.typicode.com/users',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUser),
        }
      )

      return res.json()
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['users'],
      })
    },
  })

  // LOADING
  if (isLoading) {
    return <h1>Loading...</h1>
  }

  // ERROR
  if (error) {
    return <h1>Something went wrong!</h1>
  }

  // UI
  return (
    <div>
      <h1>Users List</h1>

      <button
        onClick={() =>
          mutation.mutate({
            name: 'New User',
          })
        }
      >
        Add User
      </button>

      {data.map(user => (
        <div key={user.id}>
          <p>{user.name}</p>
        </div>
      ))}
    </div>
  )
}

export default App