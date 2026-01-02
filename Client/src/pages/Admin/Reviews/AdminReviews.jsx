import { useEffect, useState, useContext } from "react";
import "./AdminReviews.css";
import { Table, message, Popconfirm, Button, Spin, Tag, Rate } from "antd";
import { DeleteOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import { AuthContext } from "../../../context/AuthContext";

const ExpandableComment = ({ comment }) => {
    const [expanded, setExpanded] = useState(false);

    if (!comment) return "-";

    if (comment.length < 40) {
        return <span>{comment}</span>;
    }

    return (
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            <span style={{ 
                display: "block",
                maxWidth: "300px", 
                whiteSpace: expanded ? "normal" : "nowrap", 
                overflow: expanded ? "auto" : "hidden",
                maxHeight: expanded ? "100px" : "auto", 
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

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const { user } = useContext(AuthContext);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/reviews/admin/all`, {
                 credentials: "include"
            });
            if (response.ok) {
                const data = await response.json();
                setReviews(data);
            }
        } catch (error) {

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (reviewId) => {
        try {
            const response = await fetch(`${apiUrl}/reviews/${reviewId}`, {
                method: "DELETE",
                credentials: "include"
            });
            if (response.ok) {
                message.success("Yorum başarıyla silindi.");
                fetchReviews();
            } else {
                message.error("Silme işlemi başarısız.");
            }
        } catch (error) {

        }
    };

    const columns = [
        {
            title: "Görsel",
            dataIndex: "targetImage",
            key: "targetImage",
            render: (imgSrc) => (
               <img 
                    src={imgSrc || "/default-product.png"} 
                    alt="Target" 
                    style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "5px" }}
                    onError={(e) => { e.target.onerror = null; e.target.src = "/default-product.png"; }}
                />
            )
        },
        {
            title: "Hedef",
            dataIndex: "targetName",
            key: "targetName",
            render: (text, record) => (
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <strong style={{ fontSize: "14px", color: "#333" }}>{text || "İsimsiz"}</strong>
                    <div style={{ marginTop: "4px" }}>
                        <Tag color={record.targetType === "Product" ? "blue" : "green"}>
                            {record.targetType === "Product" ? "Ürün" : "Blog"}
                         </Tag>
                         <a 
                            href={record.targetType === "Product" ? `/product/${record.targetId}` : `/blog/${record.targetId}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="review-link"
                         >
                            Sayfaya Git
                         </a>
                    </div>
                </div>
            )
        },
        {
            title: "Kullanıcı",
            dataIndex: "userName",
            key: "userName",
            render: (text) => <span>{text}</span>
        },
        {
            title: "Puan",
            dataIndex: "rating",
            key: "rating",
            render: (rating) => (
                rating > 0 ? <Rate disabled defaultValue={rating} style={{ fontSize: 13 }} /> : "-"
            )
        },
        {
            title: "Yorum",
            dataIndex: "comment",
            key: "comment",
            render: (text) => <ExpandableComment comment={text} />
        },
        {
            title: "Tarih",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (text) => new Date(text).toLocaleDateString("tr-TR")
        },
        {
            title: "İşlem",
            key: "action",
            render: (_, record) => (
                <Popconfirm
                    title="Yorumu silmek istediğinize emin misiniz?"
                    onConfirm={() => handleDelete(record.id)}
                    okText="Evet"
                    cancelText="Hayır"
                >
                    <Button type="primary" danger icon={<DeleteOutlined />} size="small">
                        Sil
                    </Button>
                </Popconfirm>
            )
        }
    ];

    if (loading) return <Spin size="large" />;

    return (
        <div>
            <h2>Yorum Yönetimi</h2>
            <Table 
                columns={columns} 
                dataSource={reviews} 
                rowKey="id" 
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default AdminReviews;
