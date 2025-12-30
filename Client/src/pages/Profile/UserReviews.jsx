import { useEffect, useState, useContext } from "react";
import { Table, message, Popconfirm, Button, Spin, Tag, Rate } from "antd";
import { DeleteOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context/AuthContext";

const ExpandableComment = ({ comment }) => {
    const [expanded, setExpanded] = useState(false);

    if (!comment) return "-";

    // If comment is short enough (e.g., < 40 chars), display as is without button
    if (comment.length < 40) {
        return <span>{comment}</span>;
    }

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
            <span style={{ 
                display: "block",
                maxWidth: expanded ? "none" : "300px", 
                whiteSpace: expanded ? "normal" : "nowrap", 
                overflow: "hidden", 
                textOverflow: "ellipsis",
                textAlign: "left"
            }}>
                {comment}
            </span>
            <Button 
                type="text" 
                size="small" 
                icon={expanded ? <UpOutlined /> : <DownOutlined />} 
                onClick={() => setExpanded(!expanded)}
                style={{ marginLeft: "5px", color: "#1890ff", minWidth: "24px" }}
            />
        </div>
    );
};

const UserReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { user } = useContext(AuthContext);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/reviews/my-reviews`, {
                headers: {
                    // Authorization handled by cookie
                },
                credentials: "include"
            });
            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            }
        } catch (error) {
            console.log("Fetch reviews error", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
             fetchReviews();
        }
    }, [user]);

    const handleDelete = async (reviewId) => {
        try {
            const response = await fetch(`${apiUrl}/reviews/${reviewId}`, {
                method: "DELETE",
                headers: {
                     // Authorization handled by cookie
                },
                credentials: "include"
            });
            if (response.ok) {
                message.success("Yorum başarıyla silindi.");
                fetchReviews();
            } else {
                message.error("Silme işlemi başarısız.");
            }
        } catch (error) {
            console.log("Delete error", error);
        }
    };

    const columns = [
        {
            title: "ID",
            dataIndex: "targetId",
            key: "targetId",
            width: 220,
            align: "center",
            render: (text, record) => (
                <a href={`/${record.targetType === 'Product' ? 'product' : 'blog'}/${text}`}>
                    <Tag color="geekblue" style={{ cursor: "pointer" }}>
                         #{text}
                    </Tag>
                </a>
            )
        },
        {
            title: "Hedef",
            dataIndex: "targetType",
            key: "targetType",
            width: 100,
            align: "center",
            render: (text) => (
                <Tag color={text === "Product" ? "blue" : "green"}>
                    {text === "Product" ? "Ürün" : "Blog"}
                </Tag>
            )
        },
        {
            title: "Puan",
            dataIndex: "rating",
            key: "rating",
            width: 150,
            align: "center",
            render: (rating, record) => (
                rating > 0 ? (
                    <div style={{ display: "flex", justifyContent: "center", width: "100%", whiteSpace: "nowrap" }}>
                        <Rate disabled value={rating} style={{ fontSize: 13, color: "#fadb14" }} />
                    </div>
                ) : "-"
            )
        },
        {
            title: "Yorum",
            dataIndex: "comment",
            key: "comment",
            align: "center",
            render: (text) => <ExpandableComment comment={text} />
        },
        {
            title: "Tarih",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 120,
            align: "center",
            render: (text) => new Date(text).toLocaleDateString("tr-TR")
        },
        {
            title: "İşlem",
            key: "action",
            align: "center",
            width: 80,
            render: (_, record) => (
                <Popconfirm
                    title="Yorumu silmek istediğinize emin misiniz?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Evet"
                    cancelText="Hayır"
                >
                    <Button type="primary" danger icon={<DeleteOutlined />} size="small" />
                </Popconfirm>
            )
        }
    ];

    if (loading) return <Spin size="large" />;

    return (
        <div>
            <h2>Yorumlarım</h2>
            <Table 
                columns={columns} 
                dataSource={reviews} 
                rowKey="id" 
                pagination={{ pageSize: 5 }}
                scroll={{ x: 800 }} 
            />
        </div>
    );
};

export default UserReviews;
