import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import { Button, Col, Row, Table, Text, Tooltip, User, } from '@nextui-org/react';
import { IconButton } from '../../components/styles/IconButton';
import { EyeIcon } from '../../components/styles/EyeIcon';
import { EditIcon } from '../../components/styles/EditIcon';
import { DeleteIcon } from '../../components/styles/DeleteIcon';
import { StyledBadge } from '../../components/styles/StyledBadge';
import Link from 'next/link';
import useFirebase from '../../lib/useFirebase';
import SellDialog from '../../components/dialogs/SellDialog';

const NFTS = () => {
    const columns = [
        { name: "ID", uid: "id" },
        { name: "NAME", uid: "name" },
        { name: "PRICE", uid: "price" },
        { name: "NO OF COPIES", uid: "totalSupply" },
        { name: "ACTIONS", uid: "actions" },
    ];

    const [open, setOpen] = useState(false);

    const renderCell = (user, columnKey) => {
        const cellValue = user[columnKey];
        switch (columnKey) {
            case "name":
            case "collection":
            case "price":
            case "totalSupply":
                return (
                    <Text b size={14} css={{ tt: "capitalize" }}>
                        {cellValue}
                    </Text>
                );

            case "actions":
                return (
                    <Row justify="center" align="center">
                        <Col css={{ d: "flex" }}>
                            <Tooltip content="Delete Sell Order">
                                <div onClick={() => deleteNFT(user.id)}>
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

    const [nfts, setNfts] = useState([])

    const { getNFTsByListing, updateNFT } = useFirebase();

    async function get() {
        const nfts = await getNFTsByListing(true);
        setNfts(nfts)
    }

    function deleteNFT(id) {
        console.log(id)
        updateNFT({ id, listing: false }).then(() => {
            get()
        })
    }

    useEffect(() => {
        get()
    }, [])
    return (
        <div style={{ padding: ' 0 2rem' }}>
            <Button style={{ background: '#3d00b7' }} onClick={() => setOpen(true)} auto>
                Create Sell Order
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
                <Table.Body items={nfts}>
                    {(item) => (
                        <Table.Row>
                            {(columnKey) => (
                                <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
                            )}
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>
            {open && <SellDialog open={open} onClose={() => setOpen(false)} />}
        </div>
    );
}

export default NFTS

NFTS.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}