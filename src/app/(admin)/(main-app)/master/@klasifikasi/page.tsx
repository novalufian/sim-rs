"use client"
import { useState, useEffect } from "react"
import { IoArrowBackCircleOutline , IoArrowForwardCircleOutline} from "react-icons/io5";
import { useKlasifikasi, useKlasifikasiDelete, usePostKlasifikasi, useUpdateKlasifikasi } from "@/hooks/fetch/master/useKlasifikasi";
import SpinerLoading from "@/components/loading/spiner";

interface Todo {
    id: string
    nama: string
    isEditing: boolean
}

function TodoPage() {
    const [todos, setTodos] = useState<Todo[]>([])
    const [input, setInput] = useState("")
    const [search, setSearch] = useState("")
    const [openModal, setOpenModal] = useState(false);
    const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

    const { data : klasifikasi , isLoading : useKlasifikasiLoading} = useKlasifikasi();
    const { 
        mutateAsync : DeleteKlasifikasi, 
        isPending : DeleteKlasifikasiPending, 
        isError : DeleteKlasifikasiError, 
        isSuccess : DeleteKlasifikasiSuccess 
    } = useKlasifikasiDelete();

    const { 
        mutateAsync : CreateKlasifikasi, 
        isPending : CreateKlasifikasiPending, 
        isError : CreateKlasifikasiError, 
        isSuccess : CreateKlasifikasiSuccess 
    } = usePostKlasifikasi();

    const {
        mutateAsync : UpdateKlasifikasi, 
        isPending : UpdateKlasifikasiPending, 
        isError : UpdateKlasifikasiError, 
        isSuccess : UpdateKlasifikasiSuccess
    } = useUpdateKlasifikasi(); 

    const [deleteMessage, setDeleteMessage] = useState("")
    
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10

    useEffect(() => {
        setTodos(klasifikasi?.data?.klasifikasiJabatan ?? [])   

        if(DeleteKlasifikasiSuccess){
            setDeleteMessage("Berhasil menghapus data");
            setTimeout(() => {
                setDeleteMessage("");
                setOpenModal(false);
            }, 2000);
        }
    }, [klasifikasi, DeleteKlasifikasiSuccess])
    
    const handleAdd = () => {
        if (input.trim() === "") return
        const newTodo: Todo = {
            id: Date.now().toString(),
            nama: input.trim(),
            isEditing: false,
        }
        CreateKlasifikasi(newTodo)
        setInput("")
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleAdd();
        }
    };
    
    const handleDelete = async (id: string) => {
        try {
            await DeleteKlasifikasi(id); // Trigger the mutation
                
            // setTodos(todos.filter(todo => todo.id !== id))
        } catch (error : any) {
            console.log("Delete failed:", error.status);
            if(error.status === 403){
                setDeleteMessage("Anda tidak memiliki hak akses untuk menghapus, hanya SUPER ADMIN yang memiliki hak akses");
            }
        }
    }
    
    const handleEdit = (data: any) => {
        setTodos(todos.map(todo => todo.id === data.id ? { ...todo, isEditing: true } : todo))
        setSelectedTodo(data)
    }
    
    const handleSave = async(id: string, newText: string) => {
        try {
            console.log(newText)
            const bidang = await UpdateKlasifikasi({id : id.toString(), formData : {nama : selectedTodo?.nama}});
            setTodos(todos.map(todo =>
                todo.id === id ? { ...todo, text: newText, isEditing: false } : todo
            ))
        } catch (error : any) {
            console.log("Update failed:", error);
        }
    }
    
    const handleCancel = (id: string) => {
        setTodos(todos.map(todo => todo.id === id ? { ...todo, isEditing: false } : todo))
    }
    
    const filteredTodos = todos.filter(todo =>
        todo.nama.toLowerCase().includes(search.toLowerCase())
    )
    
    // Pagination logic
    const indexOfLastTodo = currentPage * itemsPerPage
    const indexOfFirstTodo = indexOfLastTodo - itemsPerPage
    const currentTodos = filteredTodos.slice(indexOfFirstTodo, indexOfLastTodo)
    
    const totalPages = Math.ceil(filteredTodos.length / itemsPerPage)

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1)
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1)
        }
    }


    return (
        <div className="max-w-xl mx-auto p-4 space-y-1 relative">
            <h1 className="text-2xl font-bold flex justify-between items-center">👑 Master Klasifikasi <span className="text-sm font-light text-gray-500">{todos.length} data</span></h1>
            <p className ="text-gray-500 py-2 mb-5">Jenis klasifikas jabatan untuk pegawai.</p>
        
            <div className="flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Klasifikasi baru..." className="flex-1 border border-gray-300 px-3 py-2 rounded"/>
                <button onClick={handleAdd}  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add</button>
            </div>
        
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari ex:bidang..." className="w-full border border-gray-300 px-3 py-2 rounded "/>
        
            <ul className="space-y-2">
                {currentTodos.map((todo, index) => (
                    <li key={todo.id} className="flex items-center gap-2 py-2 border-b border-gray-200">
                        <span className="flex-shrink-0 w-8 text-center">{index + 1 + (currentPage - 1) * itemsPerPage}</span> {/* Add numbering */}
                        {todo.isEditing ? (
                            <>
                                <input type="text" defaultValue={todo.nama} onChange={(e) => {
                                    setSelectedTodo({
                                        id: todo.id,
                                        nama: e.target.value.toString(),
                                        isEditing: true 
                                    })
                                }} className="flex-1 border border-gray-300 px-2 py-1 rounded"/>
                                <button onClick={() => {
                                    handleSave(todo.id, todo.nama);
                                    setDeleteMessage("");
                                }} className="text-green-600 hover:text-green-800">Save</button>
                                <button onClick={() => handleCancel(todo.id)} className="text-gray-600 hover:text-gray-800">Cancel</button>
                            </>
                        ) : (
                            <>
                                <span className="flex-1 px-2 py-1">{todo.nama}</span>
                                <button onClick={() => handleEdit(todo)} className="text-yellow-600 hover:text-yellow-800">Edit</button>
                                <button onClick={() => {
                                    setOpenModal(true)
                                    setSelectedTodo(todo)
                                }} className="text-red-600 hover:text-red-800">Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        
            {/* Pagination Controls */}
            <div className="flex justify-between items-center">
                <button onClick={handlePrevPage} disabled={currentPage === 1} className=" text-gray-700 px-4 py-2 rounded disabled:opacity-50">
                    <IoArrowBackCircleOutline className="w-10 h-10"/>
                </button> 
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages} className=" text-gray-700 px-4 py-2 rounded disabled:opacity-50">
                    <IoArrowForwardCircleOutline className="w-10 h-10"/>
                </button>
            </div>

            {openModal && (
            <div className="absolute bottom-0 left-0 right-0 flex justify-center items-center w-full h-full bg-white/20 backdrop-blur-sm">
                <div className="bg-red-200 w-8/12 max-w-md p-4 rounded-xl">
                    <h2 className="text-xl text-red-600 mb-4">Konfirmasi</h2>
                    {DeleteKlasifikasiPending ? (
                        <SpinerLoading/>
                    ) : DeleteKlasifikasiError ? (
                        <>
                        <p className="text-red-600">
                            Gagal menghapus data <strong>{selectedTodo?.nama ?? ""}</strong>!
                        </p>
                        <br />
                        <p className="text-red-600">
                            {deleteMessage}
                        </p>
                        </>
                    ) : (
                        <p className="text-red-600">
                            Apakah kamu yakin menghapus data <strong>{selectedTodo?.nama ?? ""}</strong>?
                        </p>
                    )}
                    <div className="flex justify-end mt-4">
                        <button onClick={() => handleDelete(selectedTodo?.id ?? "")} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Hapus</button>
                        <button onClick={() => setOpenModal(false)} className="ml-2 bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">Batal</button>
                    </div>

                </div>
            </div>)}
        </div>
    )
}

export default TodoPage;
