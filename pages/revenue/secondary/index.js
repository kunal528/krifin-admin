import React, { useEffect, useState } from 'react'
import Layout from '../../../components/Layout'
import { Row, Text, Table } from '@nextui-org/react';
import Link from 'next/link';
import { HiOutlineExternalLink } from 'react-icons/hi'
import useWeb3 from '../../../lib/useWeb3';

const PrimarySale = () => {
    // token id, quantity, price, by, at what time
    const columns = [
        { name: "ID", uid: "id" },
        { name: "TOKEN ID", uid: "tokenId" },
        { name: "Quantity", uid: "quantity" },
        { name: "PRICE", uid: "price" },
        { name: "Transacted BY", uid: "from" },
        { name: "Transacted AT", uid: "timestamp" },
        { name: "ACTIONS", uid: "actions" },
    ];

    const renderCell = (user, columnKey) => {
        console.log(user, columnKey)
        const cellValue = user[columnKey];
        switch (columnKey) {
            case "tokenId":
            case "quantity":
            case "from":
                return (
                    <Text b size={14} css={{ tt: "capitalize" }}>
                        {cellValue}
                    </Text>
                );
            case "price":
                return (
                    <Text b size={14} css={{ tt: "capitalize" }}>
                        {cellValue} MATIC
                    </Text>
                );
            case "timestamp":
                return (
                    <Text b size={14} css={{ tt: "capitalize" }}>
                        {new Date(cellValue * 1000).toLocaleString()}
                    </Text>
                );
            case "actions":
                return (
                    <Row justify="center" align="center">
                        <a href={`https://mumbai.polygonscan.com/tx/${user.hash}`} target="_blank">
                            <HiOutlineExternalLink size={20} fill="#979797" />
                        </a>
                    </Row>
                );

            default:
                return cellValue;
        }
    };

    const [sales, setSales] = useState([])

    const { getSales, web3, marketplaceContract, getSecondarySales } = useWeb3()

    const get = async () => {
        getSecondarySales().then(res => {
            console.log(res)
            setSales(res)
        });
    }

    useEffect(() => {
        if (web3 && marketplaceContract)
            get()
    }, [web3, marketplaceContract])

    return (
        <div style={{ padding: ' 0 2rem' }}>
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
                <Table.Body items={sales}>
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

export default PrimarySale

PrimarySale.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}