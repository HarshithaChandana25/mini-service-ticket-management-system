import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/tickets";

function App() {
    const [tickets, setTickets] = useState([]);
    const [activePage, setActivePage] = useState("tickets");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [customerFilter, setCustomerFilter] = useState("All");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedTicket, setSelectedTicket] = useState(null);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [showSupportModal, setShowSupportModal] = useState(false);

    const [formData, setFormData] = useState({
        customerName: "",
        title: "",
        description: "",
        priority: "Medium"
    });

    /* =========================================================
       FETCH TICKETS
    ========================================================= */

    const fetchTickets = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            if (!response.ok) {
                throw new Error("Failed to fetch tickets");
            }

            const data = await response.json();
            setTickets(data);
        } catch (err) {
            setError(
                "Unable to connect to the server. Please make sure the backend is running."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    /* =========================================================
       DATE FORMAT
       Uses MongoDB ObjectId as fallback for older tickets
    ========================================================= */

    const formatDate = (date, ticketId) => {
        let dateValue = date;

        if (!dateValue && ticketId) {
            try {
                const timestamp = parseInt(
                    ticketId.substring(0, 8),
                    16
                );

                dateValue = new Date(timestamp * 1000);
            } catch (error) {
                return "Not available";
            }
        }

        if (!dateValue) {
            return "Not available";
        }

        const formattedDate = new Date(dateValue);

        if (isNaN(formattedDate.getTime())) {
            return "Not available";
        }

        return formattedDate.toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    /* =========================================================
       STATUS CLASS
    ========================================================= */

    const getStatusClass = (status) => {
        switch (status) {
            case "Open":
                return "open";

            case "In Progress":
                return "in-progress";

            case "Resolved":
                return "resolved";

            case "Closed":
                return "closed";

            default:
                return "open";
        }
    };

    /* =========================================================
       CREATE TICKET
    ========================================================= */

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !formData.customerName.trim() ||
            !formData.title.trim() ||
            !formData.description.trim()
        ) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to create ticket"
                );
            }

            setTickets((prev) => [data, ...prev]);

            setFormData({
                customerName: "",
                title: "",
                description: "",
                priority: "Medium"
            });

            setShowCreateModal(false);
            setActivePage("tickets");

        } catch (err) {
            alert(err.message);
        }
    };

    /* =========================================================
       UPDATE TICKET
    ========================================================= */

    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!selectedTicket) return;

        try {
            const response = await fetch(
                `${API_URL}/${selectedTicket._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        customerName:
                            formData.customerName,
                        title: formData.title,
                        description:
                            formData.description,
                        priority: formData.priority
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update ticket"
                );
            }

            setTickets((prev) =>
                prev.map((ticket) =>
                    ticket._id === data._id
                        ? data
                        : ticket
                )
            );

            setSelectedTicket(data);
            setShowEditModal(false);
            setShowDetailsModal(true);

        } catch (err) {
            alert(err.message);
        }
    };

    /* =========================================================
       CHANGE STATUS
    ========================================================= */

    const updateStatus = async (
        ticket,
        newStatus
    ) => {
        try {
            const response = await fetch(
                `${API_URL}/${ticket._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json"
                    },
                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update status"
                );
            }

            setTickets((prev) =>
                prev.map((item) =>
                    item._id === data._id
                        ? data
                        : item
                )
            );

            setSelectedTicket(data);

        } catch (err) {
            alert(err.message);
        }
    };

    /* =========================================================
       DELETE TICKET
    ========================================================= */

    const deleteTicket = async (ticketId) => {
        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this ticket?"
            );

        if (!confirmDelete) return;

        try {
            const response = await fetch(
                `${API_URL}/${ticketId}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete ticket"
                );
            }

            setTickets((prev) =>
                prev.filter(
                    (ticket) =>
                        ticket._id !== ticketId
                )
            );

            setShowDetailsModal(false);
            setSelectedTicket(null);

        } catch (err) {
            alert(err.message);
        }
    };

    /* =========================================================
       OPEN DETAILS
    ========================================================= */

    const openDetails = (ticket) => {
        setSelectedTicket(ticket);
        setShowDetailsModal(true);
    };

    /* =========================================================
       OPEN EDIT
    ========================================================= */

    const openEdit = (ticket) => {
        setSelectedTicket(ticket);

        setFormData({
            customerName:
                ticket.customerName || "",
            title:
                ticket.title || "",
            description:
                ticket.description || "",
            priority:
                ticket.priority || "Medium"
        });

        setShowDetailsModal(false);
        setShowEditModal(true);
    };

    /* =========================================================
       CUSTOMERS
    ========================================================= */

    const customers = [
        ...new Set(
            tickets
                .map(
                    (ticket) =>
                        ticket.customerName
                )
                .filter(Boolean)
        )
    ].sort();

    /* =========================================================
       FILTER TICKETS
    ========================================================= */

    const filteredTickets =
        tickets.filter((ticket) => {

            const searchText =
                search.toLowerCase().trim();

            const matchesSearch =
                !searchText ||
                ticket.title
                    ?.toLowerCase()
                    .includes(searchText) ||
                ticket.customerName
                    ?.toLowerCase()
                    .includes(searchText);

            const matchesStatus =
                statusFilter === "All" ||
                ticket.status ===
                    statusFilter;

            const matchesPriority =
                priorityFilter === "All" ||
                ticket.priority ===
                    priorityFilter;

            const matchesCustomer =
                customerFilter === "All" ||
                ticket.customerName ===
                    customerFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority &&
                matchesCustomer
            );
        });

    /* =========================================================
       COUNTS
    ========================================================= */

    const totalTickets =
        tickets.length;

    const openTickets =
        tickets.filter(
            (ticket) =>
                ticket.status === "Open"
        ).length;

    const progressTickets =
        tickets.filter(
            (ticket) =>
                ticket.status ===
                "In Progress"
        ).length;

    const resolvedTickets =
        tickets.filter(
            (ticket) =>
                ticket.status ===
                "Resolved"
        ).length;

    const closedTickets =
        tickets.filter(
            (ticket) =>
                ticket.status ===
                "Closed"
        ).length;

    /* =========================================================
       RESET FILTERS
    ========================================================= */

    const resetFilters = () => {
        setSearch("");
        setStatusFilter("All");
        setPriorityFilter("All");
        setCustomerFilter("All");
    };

    /* =========================================================
       TICKET CARD
    ========================================================= */

    const TicketCard = ({ ticket }) => (
        <div className="ticket-card">

            <div className="ticket-main">

                <div className="ticket-left">

                    <div className="ticket-meta">

                        <span className="ticket-id">
                            #{ticket._id
                                ?.slice(-6)
                                .toUpperCase()}
                        </span>

                        <span className="customer-name">
                            {ticket.customerName}
                        </span>

                    </div>

                    <h3>
                        {ticket.title}
                    </h3>

                    <p className="description">
                        {ticket.description}
                    </p>

                </div>

                <div className="ticket-right">

                    <span
                        className={`status status-${getStatusClass(
                            ticket.status
                        )}`}
                    >
                        {ticket.status}
                    </span>

                    <span
                        className={`priority ${ticket.priority?.toLowerCase()}`}
                    >
                        {ticket.priority}
                    </span>

                </div>

            </div>

            <div className="ticket-footer">

                <div className="ticket-date">

                    <span>
                        Created
                    </span>

                    <strong>
                        {formatDate(
                            ticket.createdAt,
                            ticket._id
                        )}
                    </strong>

                </div>

                <button
                    className="view-btn"
                    onClick={() =>
                        openDetails(ticket)
                    }
                >
                    View Details →
                </button>

            </div>

        </div>
    );

    /* =========================================================
       DASHBOARD
    ========================================================= */

    const Dashboard = () => (
        <>
            <div className="header">

                <div>
                    <p className="small-title">
                        OVERVIEW
                    </p>

                    <h1>
                        Dashboard
                    </h1>

                    <p className="subtitle">
                        Monitor and manage your
                        service requests
                    </p>
                </div>

                <button
                    className="create-btn"
                    onClick={() =>
                        setShowCreateModal(
                            true
                        )
                    }
                >
                    + Create Ticket
                </button>

            </div>

            <div className="container">

                <div className="stats">

                    <div className="stat-card">
                        <span>
                            Total Tickets
                        </span>

                        <strong>
                            {totalTickets}
                        </strong>
                    </div>

                    <div className="stat-card">
                        <span>
                            Open
                        </span>

                        <strong>
                            {openTickets}
                        </strong>
                    </div>

                    <div className="stat-card">
                        <span>
                            In Progress
                        </span>

                        <strong>
                            {progressTickets}
                        </strong>
                    </div>

                    <div className="stat-card">
                        <span>
                            Resolved
                        </span>

                        <strong>
                            {resolvedTickets}
                        </strong>
                    </div>

                    <div className="stat-card">
                        <span>
                            Closed
                        </span>

                        <strong>
                            {closedTickets}
                        </strong>
                    </div>

                </div>

                <div className="tickets-section">

                    <div className="section-header">

                        <div>
                            <h2>
                                Recent Tickets
                            </h2>

                            <p>
                                Latest service
                                requests
                            </p>
                        </div>

                        <button
                            className="view-btn"
                            onClick={() =>
                                setActivePage(
                                    "tickets"
                                )
                            }
                        >
                            View All →
                        </button>

                    </div>

                    {loading ? (

                        <div className="empty">
                            Loading tickets...
                        </div>

                    ) : (

                        <div className="ticket-list">

                            {tickets
                                .slice(0, 5)
                                .map(
                                    (ticket) => (
                                        <TicketCard
                                            key={
                                                ticket._id
                                            }
                                            ticket={
                                                ticket
                                            }
                                        />
                                    )
                                )}

                        </div>

                    )}

                </div>

            </div>
        </>
    );

    /* =========================================================
       ALL TICKETS
    ========================================================= */

    const AllTickets = () => (
        <>
            <div className="header">

                <div>

                    <p className="small-title">
                        TICKET MANAGEMENT
                    </p>

                    <h1>
                        All Tickets
                    </h1>

                    <p className="subtitle">
                        Search, filter and manage
                        service requests
                    </p>

                </div>

                <button
                    className="create-btn"
                    onClick={() =>
                        setShowCreateModal(
                            true
                        )
                    }
                >
                    + Create Ticket
                </button>

            </div>

            <div className="container">

                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

                <div className="tickets-section">

                    <div className="section-header">

                        <div>
                            <h2>
                                Service Tickets
                            </h2>

                            <p>
                                {
                                    filteredTickets.length
                                }{" "}
                                tickets
                            </p>
                        </div>

                        <button
                            className="clear-btn"
                            onClick={
                                resetFilters
                            }
                        >
                            Clear Filters
                        </button>

                    </div>

                    <div className="filter-section">

                        <div className="search-box">

                            <span>
                                ⌕
                            </span>

                            <input
                                type="text"
                                placeholder="Search by title or customer"
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <select
                            value={
                                statusFilter
                            }
                            onChange={(e) =>
                                setStatusFilter(
                                    e.target.value
                                )
                            }
                        >
                            <option value="All">
                                All Status
                            </option>

                            <option value="Open">
                                Open
                            </option>

                            <option value="In Progress">
                                In Progress
                            </option>

                            <option value="Resolved">
                                Resolved
                            </option>

                            <option value="Closed">
                                Closed
                            </option>
                        </select>

                        <select
                            value={
                                priorityFilter
                            }
                            onChange={(e) =>
                                setPriorityFilter(
                                    e.target.value
                                )
                            }
                        >
                            <option value="All">
                                All Priority
                            </option>

                            <option value="Low">
                                Low
                            </option>

                            <option value="Medium">
                                Medium
                            </option>

                            <option value="High">
                                High
                            </option>
                        </select>

                        <select
                            value={
                                customerFilter
                            }
                            onChange={(e) =>
                                setCustomerFilter(
                                    e.target.value
                                )
                            }
                        >
                            <option value="All">
                                All Customers
                            </option>

                            {customers.map(
                                (customer) => (
                                    <option
                                        key={
                                            customer
                                        }
                                        value={
                                            customer
                                        }
                                    >
                                        {customer}
                                    </option>
                                )
                            )}
                        </select>

                    </div>

                    {loading ? (

                        <div className="empty">
                            Loading tickets...
                        </div>

                    ) : filteredTickets.length ===
                      0 ? (

                        <div className="empty">

                            <h3>
                                No tickets found
                            </h3>

                            <p>
                                Try changing your
                                search or filters.
                            </p>

                        </div>

                    ) : (

                        <div className="ticket-list">

                            {filteredTickets.map(
                                (ticket) => (
                                    <TicketCard
                                        key={
                                            ticket._id
                                        }
                                        ticket={
                                            ticket
                                        }
                                    />
                                )
                            )}

                        </div>

                    )}

                </div>

            </div>
        </>
    );

    /* =========================================================
       CREATE TICKET PAGE
    ========================================================= */

    const CreateTicketPage = () => (
        <>
            <div className="header">

                <div>

                    <p className="small-title">
                        NEW REQUEST
                    </p>

                    <h1>
                        Create Ticket
                    </h1>

                    <p className="subtitle">
                        Create a new service
                        request
                    </p>

                </div>

            </div>

            <div className="container">

                <div className="form-card">

                    <div className="form-card-header">

                        <h2>
                            Ticket Information
                        </h2>

                        <p>
                            Enter the details of
                            the customer request.
                        </p>

                    </div>

                    <form
                        className="page-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">

                            <label>
                                Customer Name *
                            </label>

                            <input
                                type="text"
                                value={
                                    formData.customerName
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        customerName:
                                            e.target.value
                                    })
                                }
                                placeholder="Enter customer name"
                            />

                        </div>

                        <div className="form-group">

                            <label>
                                Priority
                            </label>

                            <select
                                value={
                                    formData.priority
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        priority:
                                            e.target.value
                                    })
                                }
                            >

                                <option value="Low">
                                    Low
                                </option>

                                <option value="Medium">
                                    Medium
                                </option>

                                <option value="High">
                                    High
                                </option>

                            </select>

                        </div>

                        <div className="form-group full">

                            <label>
                                Ticket Title *
                            </label>

                            <input
                                type="text"
                                value={
                                    formData.title
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        title:
                                            e.target.value
                                    })
                                }
                                placeholder="Enter ticket title"
                            />

                        </div>

                        <div className="form-group full">

                            <label>
                                Description *
                            </label>

                            <textarea
                                value={
                                    formData.description
                                }
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        description:
                                            e.target.value
                                    })
                                }
                                placeholder="Describe the issue..."
                            />

                        </div>

                        <div className="form-actions">

                            <button
                                type="submit"
                                className="submit-btn"
                            >
                                Create Ticket
                            </button>

                        </div>

                    </form>

                </div>

            </div>
        </>
    );

    /* =========================================================
       APP
    ========================================================= */

    return (
        <div className="app">

            {/* SIDEBAR */}

            <aside className="sidebar">

                <div className="logo">

                    <div>

                        <h2>
                            Service Ticket System
                        </h2>

                        <span>
                            Ticket Management
                        </span>

                    </div>

                </div>

                <div className="sidebar-line"></div>

                <nav className="nav">

                    <p className="nav-label">
                        WORKSPACE
                    </p>

                    <button
                        className={
                            activePage === "tickets"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActivePage(
                                "tickets"
                            )
                        }
                    >
                        <span className="nav-icon">
                            ▣
                        </span>

                        <span>
                            All Tickets
                        </span>
                    </button>

                    <button
                        className={
                            activePage === "create"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActivePage(
                                "create"
                            )
                        }
                    >
                        <span className="nav-icon">
                            +
                        </span>

                        <span>
                            Create Ticket
                        </span>
                    </button>

                </nav>

                <div className="sidebar-bottom">

                    <p className="nav-label">
                        SUPPORT
                    </p>

                    <button
                        onClick={() =>
                            setShowHelpModal(
                                true
                            )
                        }
                    >
                        <span className="nav-icon">
                            ?
                        </span>

                        <span>
                            Need Help
                        </span>
                    </button>

                    <button
                        onClick={() =>
                            setShowSupportModal(
                                true
                            )
                        }
                    >
                        <span className="nav-icon">
                            ✉
                        </span>

                        <span>
                            Support Team
                        </span>
                    </button>

                    <div className="sidebar-line bottom-line"></div>

                    <button
                        className={
                            activePage ===
                            "dashboard"
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActivePage(
                                "dashboard"
                            )
                        }
                    >
                        <span className="nav-icon">
                            ▤
                        </span>

                        <span>
                            Dashboard
                        </span>
                    </button>

                </div>

            </aside>

            {/* MAIN */}

            <main className="main">

                {activePage ===
                    "dashboard" && (
                    <Dashboard />
                )}

                {activePage ===
                    "tickets" && (
                    <AllTickets />
                )}

                {activePage ===
                    "create" && (
                    <CreateTicketPage />
                )}

            </main>

            {/* =================================================
                CREATE MODAL
            ================================================= */}

            {showCreateModal && (

                <div
                    className="modal-overlay"
                    onClick={() =>
                        setShowCreateModal(
                            false
                        )
                    }
                >

                    <div
                        className="modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>

                                <p className="small-title">
                                    NEW TICKET
                                </p>

                                <h2>
                                    Create Ticket
                                </h2>

                            </div>

                            <button
                                className="close-btn"
                                onClick={() =>
                                    setShowCreateModal(
                                        false
                                    )
                                }
                            >
                                ×
                            </button>

                        </div>

                        <form
                            className="modal-form"
                            onSubmit={handleSubmit}
                        >

                            <div className="form-group">

                                <label>
                                    Customer Name *
                                </label>

                                <input
                                    type="text"
                                    value={
                                        formData.customerName
                                    }
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            customerName:
                                                e.target.value
                                        })
                                    }
                                />

                            </div>

                            <div className="form-group">

                                <label>
                                    Priority
                                </label>

                                <select
                                    value={
                                        formData.priority
                                    }
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            priority:
                                                e.target.value
                                        })
                                    }
                                >

                                    <option value="Low">
                                        Low
                                    </option>

                                    <option value="Medium">
                                        Medium
                                    </option>

                                    <option value="High">
                                        High
                                    </option>

                                </select>

                            </div>

                            <div className="form-group full">

                                <label>
                                    Ticket Title *
                                </label>

                                <input
                                    type="text"
                                    value={
                                        formData.title
                                    }
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            title:
                                                e.target.value
                                        })
                                    }
                                />

                            </div>

                            <div className="form-group full">

                                <label>
                                    Description *
                                </label>

                                <textarea
                                    value={
                                        formData.description
                                    }
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            description:
                                                e.target.value
                                        })
                                    }
                                />

                            </div>

                            <button
                                type="submit"
                                className="submit-btn"
                            >
                                Create Ticket
                            </button>

                        </form>

                    </div>

                </div>

            )}

            {/* =================================================
                DETAILS MODAL
            ================================================= */}

            {showDetailsModal &&
                selectedTicket && (

                    <div
                        className="modal-overlay"
                        onClick={() =>
                            setShowDetailsModal(
                                false
                            )
                        }
                    >

                        <div
                            className="modal details-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="modal-header">

                                <div>

                                    <p className="small-title">
                                        TICKET DETAILS
                                    </p>

                                    <h2>
                                        {
                                            selectedTicket.title
                                        }
                                    </h2>

                                </div>

                                <button
                                    className="close-btn"
                                    onClick={() =>
                                        setShowDetailsModal(
                                            false
                                        )
                                    }
                                >
                                    ×
                                </button>

                            </div>

                            <div className="details">

                                <div className="detail-row">

                                    <span>
                                        Ticket ID
                                    </span>

                                    <strong>
                                        #
                                        {selectedTicket._id
                                            ?.slice(-6)
                                            .toUpperCase()}
                                    </strong>

                                </div>

                                <div className="detail-row">

                                    <span>
                                        Customer
                                    </span>

                                    <strong>
                                        {
                                            selectedTicket.customerName
                                        }
                                    </strong>

                                </div>

                                <div className="detail-row">

                                    <span>
                                        Priority
                                    </span>

                                    <strong>
                                        <span
                                            className={`priority ${selectedTicket.priority?.toLowerCase()}`}
                                        >
                                            {
                                                selectedTicket.priority
                                            }
                                        </span>
                                    </strong>

                                </div>

                                <div className="detail-row">

                                    <span>
                                        Status
                                    </span>

                                    <select
                                        value={
                                            selectedTicket.status
                                        }
                                        onChange={(e) =>
                                            updateStatus(
                                                selectedTicket,
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="Open">
                                            Open
                                        </option>

                                        <option value="In Progress">
                                            In Progress
                                        </option>

                                        <option value="Resolved">
                                            Resolved
                                        </option>

                                        <option value="Closed">
                                            Closed
                                        </option>

                                    </select>

                                </div>

                                <div className="description-box">

                                    <span>
                                        DESCRIPTION
                                    </span>

                                    <p>
                                        {
                                            selectedTicket.description
                                        }
                                    </p>

                                </div>

                                <div className="detail-row">

                                    <span>
                                        Created
                                    </span>

                                    <strong>
                                        {formatDate(
                                            selectedTicket.createdAt,
                                            selectedTicket._id
                                        )}
                                    </strong>

                                </div>

                                <div className="detail-row">

                                    <span>
                                        Last Updated
                                    </span>

                                    <strong>
                                        {formatDate(
                                            selectedTicket.updatedAt,
                                            selectedTicket._id
                                        )}
                                    </strong>

                                </div>

                            </div>

                            <div className="detail-actions">

                                <button
                                    className="btn-secondary"
                                    onClick={() =>
                                        openEdit(
                                            selectedTicket
                                        )
                                    }
                                >
                                    Edit Ticket
                                </button>

                                <button
                                    className="btn-danger"
                                    onClick={() =>
                                        deleteTicket(
                                            selectedTicket._id
                                        )
                                    }
                                >
                                    Delete Ticket
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            {/* =================================================
                EDIT MODAL
            ================================================= */}

            {showEditModal &&
                selectedTicket && (

                    <div
                        className="modal-overlay"
                        onClick={() =>
                            setShowEditModal(
                                false
                            )
                        }
                    >

                        <div
                            className="modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="modal-header">

                                <div>

                                    <p className="small-title">
                                        UPDATE TICKET
                                    </p>

                                    <h2>
                                        Edit Ticket
                                    </h2>

                                </div>

                                <button
                                    className="close-btn"
                                    onClick={() =>
                                        setShowEditModal(
                                            false
                                        )
                                    }
                                >
                                    ×
                                </button>

                            </div>

                            <form
                                className="modal-form"
                                onSubmit={
                                    handleUpdate
                                }
                            >

                                <div className="form-group">

                                    <label>
                                        Customer Name
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            formData.customerName
                                        }
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                customerName:
                                                    e.target.value
                                            })
                                        }
                                    />

                                </div>

                                <div className="form-group">

                                    <label>
                                        Priority
                                    </label>

                                    <select
                                        value={
                                            formData.priority
                                        }
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                priority:
                                                    e.target.value
                                            })
                                        }
                                    >

                                        <option value="Low">
                                            Low
                                        </option>

                                        <option value="Medium">
                                            Medium
                                        </option>

                                        <option value="High">
                                            High
                                        </option>

                                    </select>

                                </div>

                                <div className="form-group full">

                                    <label>
                                        Ticket Title
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            formData.title
                                        }
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                title:
                                                    e.target.value
                                            })
                                        }
                                    />

                                </div>

                                <div className="form-group full">

                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        value={
                                            formData.description
                                        }
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description:
                                                    e.target.value
                                            })
                                        }
                                    />

                                </div>

                                <button
                                    type="submit"
                                    className="submit-btn"
                                >
                                    Save Changes
                                </button>

                            </form>

                        </div>

                    </div>

                )}

            {/* =================================================
                HELP MODAL
            ================================================= */}

            {showHelpModal && (

                <div
                    className="modal-overlay"
                    onClick={() =>
                        setShowHelpModal(
                            false
                        )
                    }
                >

                    <div
                        className="modal help-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>

                                <p className="small-title">
                                    SUPPORT
                                </p>

                                <h2>
                                    Need Help?
                                </h2>

                            </div>

                            <button
                                className="close-btn"
                                onClick={() =>
                                    setShowHelpModal(
                                        false
                                    )
                                }
                            >
                                ×
                            </button>

                        </div>

                        <div className="help-content">

                            <div className="help-item">

                                <strong>
                                    Create a Ticket
                                </strong>

                                <p>
                                    Use Create Ticket
                                    to submit a new
                                    service request.
                                </p>

                            </div>

                            <div className="help-item">

                                <strong>
                                    Find a Ticket
                                </strong>

                                <p>
                                    Search by ticket
                                    title or customer
                                    name and use the
                                    filters.
                                </p>

                            </div>

                            <div className="help-item">

                                <strong>
                                    Update Status
                                </strong>

                                <p>
                                    Open a ticket and
                                    select the required
                                    status.
                                </p>

                            </div>

                            <div className="help-item">

                                <strong>
                                    Edit or Delete
                                </strong>

                                <p>
                                    Open ticket details
                                    to edit or delete
                                    the ticket.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            )}

            {/* =================================================
                SUPPORT MODAL
            ================================================= */}

            {showSupportModal && (

                <div
                    className="modal-overlay"
                    onClick={() =>
                        setShowSupportModal(
                            false
                        )
                    }
                >

                    <div
                        className="modal support-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="modal-header">

                            <div>

                                <p className="small-title">
                                    SERVICE DESK
                                </p>

                                <h2>
                                    Support Team
                                </h2>

                                <p>
                                    Service desk support
                                </p>

                            </div>

                            <button
                                className="close-btn"
                                onClick={() =>
                                    setShowSupportModal(
                                        false
                                    )
                                }
                            >
                                ×
                            </button>

                        </div>

                        <div className="support-content">

                            <div className="support-card">

                                <div className="support-icon">
                                    ✉
                                </div>

                                <div>
                                    <span>
                                        Email
                                    </span>

                                    <strong>
                                        harshithachandana@gmail.com
                                    </strong>
                                </div>

                            </div>

                            <div className="support-card">

                                <div className="support-icon">
                                    ☎
                                </div>

                                <div>
                                    <span>
                                        Phone
                                    </span>

                                    <strong>
                                        +91 6364257717
                                    </strong>
                                </div>

                            </div>

                            <div className="support-card">

                                <div className="support-icon">
                                    ◷
                                </div>

                                <div>
                                    <span>
                                        Working Hours
                                    </span>

                                    <strong>
                                        Monday - Friday
                                        <br />
                                        9:00 AM - 6:00 PM
                                    </strong>
                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default App;