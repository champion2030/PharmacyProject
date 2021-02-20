let servers = [
    {id: '1', name: 'AWS', status: 'working'},
    {id: '2', name: 'Samsung', status: 'working'},
    {id: '3', name: 'Microsoft', status: 'working'},
    {id: '4', name: 'Apple', status: 'pending'},

]

export const getAll = (req, res) => {
    res.status(200).json(servers)
}