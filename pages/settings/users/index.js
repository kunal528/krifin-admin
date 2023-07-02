import React from 'react'
import Layout from '../../../components/Layout'
import { Button, Col, Row, Table, Text, Tooltip } from '@nextui-org/react';
import Link from 'next/link';
import { EditIcon } from '../../../components/styles/EditIcon';
import { DeleteIcon } from '../../../components/styles/DeleteIcon';
import UserDialog from '../../../components/dialogs/UserDialog';
import useAccess from '../../../lib/useAccess';
import { toast } from 'react-toastify';

const Users = () => {
    const columns = [
        { name: "ID", uid: "id" },
        { name: "NAME", uid: "name" },
        { name: "EMAIL", uid: "email" },
        { name: "ROLE", uid: "role" },
        { name: "ACTIONS", uid: "actions" },
    ];

    const renderCell = (user, columnKey) => {
        const cellValue = user[columnKey];
        switch (columnKey) {
            case "name":
            case "email":
            case "role":
                return (
                    <Text b size={14} css={{ tt: "capitalize" }}>
                        {cellValue}
                    </Text>
                );
            case "actions":
                return (
                    <Row justify="center" align="center">
                        <Col css={{ d: "flex" }}>
                            <Tooltip content="Details">
                                <div onClick={() => {
                                    setSelectedUser(user)
                                    setOpen(true)
                                }}>
                                    <EditIcon size={20} fill="#979797" />
                                </div>
                            </Tooltip>
                        </Col>
                        <Col css={{ d: "flex" }}>
                            <Tooltip content="Delete user">
                                <div onClick={() => handleRemove(user.id)}>
                                    <DeleteIcon size={20} fill="#FF0080" />
                                </div>
                            </Tooltip>
                        </Col>
                    </Row>
                );
            default:
                return cellValue;
        }
    };

    const [open, setOpen] = React.useState(false);

    const [selectedUser, setSelectedUser] = React.useState({})

    const [users, setUsers] = React.useState([])

    const { getUsers, removeUser } = useAccess()

    const handleRemove = async (id) => {
        console.log(id)
        if (confirm('Are you sure you want to remove this user?') === false) return
        await toast.promise(removeUser(id), {
            pending: 'Removing user...',
            success: 'User removed successfully',
            error: 'Error removing user'
        })
        getUsers().then((res) => {
            setUsers(res)
        })
    }

    React.useEffect(() => {
        getUsers().then((res) => {
            setUsers(res)
        })
    }, [])
    return (
        <div style={{ padding: ' 0 2rem' }}>
            <Button style={{ background: '#3d00b7' }} auto onClick={() => setOpen(true)}>
                Create User
            </Button>
            <Table
                aria-label="Example table with custom cells"
                css={{
                    height: "auto",
                    minWidth: "100%",
                }}
                selectionMode="none"
                lined
                shadow={false}

            >
                <Table.Header columns={columns}>
                    {(column) => (
                        <Table.Column
                            key={column.uid}
                            hideHeader={column.uid === "actions"}
                            align={column.uid === "actions" ? "center" : "start"}
                        >
                            {column.name}
                        </Table.Column>
                    )}
                </Table.Header>
                <Table.Body items={users}>
                    {(item) => (
                        <Table.Row>
                            {(columnKey) => (
                                <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
                            )}
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
            {open && <UserDialog visible={open} closeHandler={() => { setOpen(false); setSelectedUser(null) }} user={selectedUser} />}
        </div>
    )
}

export default Users

Users.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    );
}