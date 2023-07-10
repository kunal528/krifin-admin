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
import { toast } from 'react-toastify';
import useWeb3 from '../../lib/useWeb3';

const NFTS = () => {
    const columns = [
        { name: "ID", uid: "id" },
        { name: "NAME", uid: "name" },
        { name: "PRICE", uid: "price" },
        { name: "NO OF COPIES", uid: "totalSupply" },
        { name: "ACTIONS", uid: "actions" },
    ];

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
                            <Tooltip content="Details">
                                <Link href={{
                                    pathname: `/nfts/${user.id}`,
                                    query: { edit: false }
                                }}>
                                    <EyeIcon size={20} fill="#979797" />
                                </Link>
                            </Tooltip>
                        </Col>
                        <Col css={{ d: "flex" }}>
                            <Tooltip content="Edit">
                                <Link href={{
                                    pathname: `/nfts/${user.id}`,
                                    query: { edit: true }
                                }}>
                                    <EditIcon size={20} fill="#979797" />
                                </Link>
                            </Tooltip>
                        </Col>
                        <Col css={{ d: "flex" }}>
                            <Tooltip content="Delete">
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


    const handleRemove = async (id) => {
        await toast.promise(delistNFT(id), {
            pending: 'Deleting...',
            success: 'Deleted successfully',
            error: 'Error deleting'
        })

        await toast.promise(deleteNFT(id), {
            pending: 'Deleting...',
            success: 'Deleted successfully',
            error: 'Error deleting'
        })

    }

    const [nfts, setNfts] = useState([])

    const { getNFTs, deleteNFT } = useFirebase();

    const { mint, listNFT, delistNFT, web3, fnftContract, marketplaceContract, account } = useWeb3();

    async function get() {
        const nfts = await getNFTs();
        setNfts(nfts)
    }

    useEffect(() => {
        get()
    }, [])

    // const handleUpdateContract = async () => {
    //     for (let i = 0; i < nfts.length; i++) {
    //         const nft = nfts[i];
    //         const { id, price, totalSupply } = nft;
    //         if (id !== "1") {
    //             const minted = await mint(totalSupply);
    //         }
    //         const listed = await listNFT(id, totalSupply, price, 1);
    //     }
    // }
    return (
        <div style={{ padding: ' 0 2rem' }}>
            <Button style={{ background: '#3d00b7' }} auto>
                <Link href="/nfts/create">Create NFT</Link>
            </Button>
            {/* <div onClick={handleUpdateContract}>Test</div> */}
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
                            width={column.uid === "actions" ? "100px" : undefined}
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