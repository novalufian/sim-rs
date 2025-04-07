import ComponentCard from '@/components/common/ComponentCard'
import Button from '@/components/ui/button/Button'
import { CalenderIcon, ChevronDownIcon, PaperPlaneIcon } from '@/icons'
import React from 'react'
import DropzoneComponent from '../../form-elements/DropZone'
import Input from '../../input/InputField'
import Label from '../../Label'
import TextArea from '../../input/TextArea'
import Select from '../../Select'

function LaporForm() {

    const [messageTwo, setMessageTwo] = React.useState('')
    const options = [
        { value: "marketing", label: "Marketing" },
        { value: "template", label: "Template" },
        { value: "development", label: "Development" },
    ];

    const handleSelectChange = (value: string) => {
        console.log("Selected value:", value);
    };
    
    return (
        <ComponentCard title='Form aduan' className=' col-span-8 '>
        <div className="w-full space-y-6 grid grid-cols-12 gap-4">
            <div className='col-span-12'>
                <Label required>Judul Laporan</Label>
                <Input type="text" placeholder='laporan . . .'/>
            </div>

            <div className='col-span-6'>
                <Label required>Bidang yang dituju</Label>
                <div className="relative">
                    <Select
                        options={options}
                        placeholder="Select Option"
                        onChange={handleSelectChange}
                        className="dark:bg-dark-900"
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <ChevronDownIcon/>
                    </span>
                </div>
            </div>
            <div className='col-span-6'>
                <Label htmlFor="datePicker" required>Tanggal Kejadian</Label>
                <div className="relative">
                    <Input
                    type="date"
                    id="datePicker"
                    name="datePicker"
                    onChange={(e) => console.log(e.target.value)}
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <CalenderIcon />
                    </span>
                </div>
            </div>

            <div className='col-span-12'>
                <Label required>Isi Laporan</Label>
                <TextArea
                    rows={6}
                    value={messageTwo}
                    error
                    onChange={(value) => setMessageTwo(value)}
                    hint="Please enter a valid message."
                />
            </div>
            <div className='col-span-6'>
                <Label required>Email</Label>
                <Input type="email" placeholder='emailkamu@gmail.com'/>
            </div>
            <div className='col-span-6'>
                <Label required>No. HP</Label>
                <Input type="number"  />
            </div>
            <div className="col-span-12">
                <DropzoneComponent />
            </div>

            <div className="col-span-12 flex justify-end">
                <Button size="sm" className="w-auto bg-gray-300 hover:bg-gray-800 mr-3 text-gray-800 hover:text-white">
                Batalkan
                </Button>
                <Button size="sm" className="w-auto">
                Kirim Laporan
                <PaperPlaneIcon />
                </Button>
            </div>
        </div>
    </ComponentCard>
    )
}

export default LaporForm