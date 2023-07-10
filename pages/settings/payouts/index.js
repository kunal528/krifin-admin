import { Button, Col, Row, Table, Text, Tooltip } from '@nextui-org/react'
import React, { useEffect } from 'react'
import { EditIcon } from '../../../components/styles/EditIcon';
import { DeleteIcon } from '../../../components/styles/DeleteIcon';
import PayoutDialog from '../../../components/dialogs/PayoutDialog';
import Layout from '../../../components/Layout';
import useFirebase from '../../../lib/useFirebase';
import { toast } from 'react-toastify';
import useWeb3 from '../../../lib/useWeb3';

const Payouts = () => {
    const columns = [
        { name: "ID", uid: "id" },
        { name: "NAME", uid: "name" },
        { name: "ACTIONS", uid: "actions", align: 'right', width: '100px' },
    ];

    const renderCell = (user, columnKey) => {
        const cellValue = user[columnKey];
        switch (columnKey) {
            case "name":
                return (
                    <Text b size={14} css={{ tt: "capitalize", }}>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            {cellValue}
                        </div>
                    </Text>
                );
            case "actions":
                return (
                    <Row justify="flex-end" align="center">
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

    const [selectedUser, setSelectedUser] = React.useState(null)

    const [users, setUsers] = React.useState([])

    const [open, setOpen] = React.useState(false)

    const { getPayoutGroups,deletePayoutGroup  } = useFirebase();

    const { deletePayoutGroup: remove  } = useWeb3()


    useEffect(() => {
        getPayoutGroups().then((data) => {
            setUsers(data)
        })
    }, [])

    const handleRemove = async (id) => {
        console.log(id)
        if (id == 1) return toast.error('You cannot remove this payout group')
        if (confirm('Are you sure you want to remove this user?') === false) return
        await toast.promise(remove(id), {
            pending: 'Removing payout group...',
            success: 'Payout group removed successfully',
            error: 'Error removing payout group'
        })
        await toast.promise(deletePayoutGroup(id), {
            pending: 'Removing payout group...',
            success: 'Payout group removed successfully',
            error: 'Error removing payout group'
        })
        getPayoutGroups().then((res) => {
            setUsers(res)
        })
    }


    return (
        <div style={{ padding: ' 0 2rem' }}>
            <Button style={{ background: '#3d00b7' }} auto onClick={() => {
                setOpen(true)
            }}>
                Create Payout Group
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
                            align={column.uid === "actions" ? "right" : "start"}
                            width={column.width}
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
            {open && <PayoutDialog visible={open} closeHandler={() => {
                setOpen(false);
                setSelectedUser(null);
                getPayoutGroups().then((data) => {
                    setUsers(data)
                })
            }} group={selectedUser} />}
        </div>

    )
}

export default Payouts

Payouts.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}