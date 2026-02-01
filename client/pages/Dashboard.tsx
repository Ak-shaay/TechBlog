import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Trash2, Edit, Plus, User as UserIcon, Mail, Users, FileText, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SEO from '@/components/SEO';

const POSTS_PER_PAGE = 5;

const Dashboard = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Data States
    const [blogs, setBlogs] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [influencers, setInfluencers] = useState<any[]>([]);
    const [revenueRecords, setRevenueRecords] = useState<any[]>([]);
    const [revenueSummary, setRevenueSummary] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Blog Filter States
    const [blogSearch, setBlogSearch] = useState('');
    const [blogPage, setBlogPage] = useState(1);

    // Influencer Form State
    const [showInfluencerDialog, setShowInfluencerDialog] = useState(false);
    const [editingInfluencer, setEditingInfluencer] = useState<any>(null);
    const [infName, setInfName] = useState('');
    const [infInstagram, setInfInstagram] = useState('');
    const [infEmail, setInfEmail] = useState('');
    const [infBio, setInfBio] = useState('');

    // Revenue Form State
    const [showRevenueDialog, setShowRevenueDialog] = useState(false);
    const [revInfluencerId, setRevInfluencerId] = useState('');
    const [revAmount, setRevAmount] = useState('');
    const [revStartDate, setRevStartDate] = useState('');
    const [revEndDate, setRevEndDate] = useState('');
    const [revNotes, setRevNotes] = useState('');

    // Tab State (sync with URL usually better, but local state fine for now)
    const [activeTab, setActiveTab] = useState("blogs");

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        // ONLY fetch when user object is available
        if (user) {
            fetchData();
        }
    }, [isAuthenticated, user, navigate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                fetchBlogs(),
                fetchMessages(),
                fetchSubscribers(),
                fetchInfluencers(),
                fetchRevenueRecords(),
                fetchRevenueSummary()
            ]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInfluencers = async () => {
        const res = await fetch('/api/influencers');
        if (res.ok) setInfluencers(await res.json());
    };

    const fetchRevenueRecords = async () => {
        const res = await fetch('/api/revenue', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) setRevenueRecords(await res.json());
    };

    const fetchRevenueSummary = async () => {
        const res = await fetch('/api/revenue/summary', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) setRevenueSummary(await res.json());
    };

    const fetchBlogs = async () => {
        const res = await fetch('/api/blogs');
        const data = await res.json();
        // Client-side filter for now since API returns all
        if (data && user?.id) {
            const userBlogs = data.filter((b: any) => {
                const authorId = typeof b.author === 'object' ? b.author._id : b.author;
                return authorId === user.id;
            });
            setBlogs(userBlogs);
        }
    };

    const fetchMessages = async () => {
        const res = await fetch('/api/contact', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) setMessages(await res.json());
    };

    const fetchSubscribers = async () => {
        const res = await fetch('/api/subscribe', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) setSubscribers(await res.json());
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            const res = await fetch(`/api/blogs/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                toast.success('Blog deleted');
                fetchBlogs();
            } else {
                toast.error('Failed to delete');
            }
        } catch (error) {
            toast.error('Error deleting');
        }
    };

    const handleDeleteMessage = async (id: string) => {
        if (!confirm('Delete this message?')) return;
        try {
            const res = await fetch(`/api/contact/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                toast.success('Message deleted');
                fetchMessages();
            } else {
                toast.error('Failed to delete');
            }
        } catch (error) {
            toast.error('Error deleting');
        }
    };

    const handleDeleteSubscriber = async (id: string) => {
        if (!confirm('Remove this subscriber?')) return;
        try {
            const res = await fetch(`/api/subscribe/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                toast.success('Subscriber removed');
                fetchSubscribers();
            } else {
                toast.error('Failed to remove');
            }
        } catch (error) {
            toast.error('Error removing');
        }
    };

    const handleSaveInfluencer = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingInfluencer ? 'PUT' : 'POST';
        const url = editingInfluencer ? `/api/influencers/${editingInfluencer._id}` : '/api/influencers';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    name: infName,
                    instagramId: infInstagram,
                    email: infEmail,
                    bio: infBio
                })
            });

            if (res.ok) {
                toast.success(`Influencer ${editingInfluencer ? 'updated' : 'created'}`);
                setShowInfluencerDialog(false);
                fetchInfluencers();
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to save');
            }
        } catch (error) {
            toast.error('Error saving influencer');
        }
    };

    const handleDeleteInfluencer = async (id: string) => {
        if (!confirm('Delete this influencer? This may break existing blog links.')) return;
        try {
            const res = await fetch(`/api/influencers/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                toast.success('Influencer deleted');
                fetchInfluencers();
            }
        } catch (error) {
            toast.error('Error deleting influencer');
        }
    };

    const handleLogRevenue = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/revenue', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    influencerId: revInfluencerId,
                    amount: revAmount,
                    startDate: revStartDate,
                    endDate: revEndDate,
                    notes: revNotes
                })
            });

            if (res.ok) {
                toast.success('Revenue logged');
                setShowRevenueDialog(false);
                fetchRevenueRecords();
                fetchRevenueSummary();
            }
        } catch (error) {
            toast.error('Error logging revenue');
        }
    };

    const handleMarkPaid = async (id: string) => {
        try {
            const res = await fetch(`/api/revenue/${id}/paid`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                toast.success('Marked as paid');
                fetchRevenueRecords();
                fetchRevenueSummary();
            }
        } catch (error) {
            toast.error('Error updating status');
        }
    };

    // Filtered Blogs Logic
    const filteredBlogs = useMemo(() => {
        return blogs.filter(blog =>
            blog.title.toLowerCase().includes(blogSearch.toLowerCase())
        );
    }, [blogs, blogSearch]);

    const paginatedBlogs = useMemo(() => {
        const start = (blogPage - 1) * POSTS_PER_PAGE;
        return filteredBlogs.slice(start, start + POSTS_PER_PAGE);
    }, [filteredBlogs, blogPage]);

    const totalPages = Math.ceil(filteredBlogs.length / POSTS_PER_PAGE);

    if (!isAuthenticated) return null;

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <SEO title="Dashboard" description="Admin dashboard" noIndex={true} />
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground">Manage your content and audience.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium hidden sm:inline">Welcome, {user?.username}</span>
                        <Button onClick={logout} variant="outline" size="sm">Logout</Button>
                    </div>
                </div>

                <Tabs defaultValue="blogs" className="w-full" onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-5 mb-8">
                        <TabsTrigger value="blogs" className="flex gap-2"><FileText className="w-4 h-4" /> Blogs</TabsTrigger>
                        <TabsTrigger value="influencers" className="flex gap-2"><Users className="w-4 h-4" /> Influencers</TabsTrigger>
                        <TabsTrigger value="revenue" className="flex gap-2"><FileText className="w-4 h-4" /> Revenue</TabsTrigger>
                        <TabsTrigger value="messages" className="flex gap-2"><Mail className="w-4 h-4" /> Messages</TabsTrigger>
                        <TabsTrigger value="subscribers" className="flex gap-2"><Users className="w-4 h-4" /> Subscribers</TabsTrigger>
                    </TabsList>

                    {/* INFLUENCERS TAB */}
                    <TabsContent value="influencers" className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Manage Influencers</h2>
                            <Button onClick={() => {
                                setEditingInfluencer(null);
                                setInfName('');
                                setInfInstagram('');
                                setInfEmail('');
                                setInfBio('');
                                setShowInfluencerDialog(true);
                            }}>
                                <Plus className="mr-2 h-4 w-4" /> Add Influencer
                            </Button>
                        </div>

                        <Card>
                            <CardContent className="p-0">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted text-muted-foreground font-medium border-b">
                                        <tr>
                                            <th className="p-4">Name / Slug</th>
                                            <th className="p-4">Instagram ID</th>
                                            <th className="p-4">Email</th>
                                            <th className="p-4 w-[100px]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {influencers.map(inf => (
                                            <tr key={inf._id} className="hover:bg-muted/50">
                                                <td className="p-4">
                                                    <div className="font-semibold">{inf.name}</div>
                                                    <div className="text-xs text-muted-foreground">/{inf.slug}</div>
                                                </td>
                                                <td className="p-4">@{inf.instagramId}</td>
                                                <td className="p-4">{inf.email || '-'}</td>
                                                <td className="p-4 flex gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => {
                                                        setEditingInfluencer(inf);
                                                        setInfName(inf.name);
                                                        setInfInstagram(inf.instagramId);
                                                        setInfEmail(inf.email || '');
                                                        setInfBio(inf.bio || '');
                                                        setShowInfluencerDialog(true);
                                                    }}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteInfluencer(inf._id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* REVENUE TAB */}
                    <TabsContent value="revenue" className="space-y-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card className="bg-blue-50 border-blue-100">
                                <CardContent className="pt-6">
                                    <div className="text-sm font-medium text-blue-600 mb-1">Total Logged</div>
                                    <div className="text-2xl font-bold text-blue-900">
                                        ${(revenueSummary.reduce((acc, s) => acc + s.totalAmount, 0) / 100).toFixed(2)}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-green-50 border-green-100">
                                <CardContent className="pt-6">
                                    <div className="text-sm font-medium text-green-600 mb-1">Paid Out</div>
                                    <div className="text-2xl font-bold text-green-900">
                                        ${(revenueSummary.reduce((acc, s) => acc + s.paidAmount, 0) / 100).toFixed(2)}
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-amber-50 border-amber-100">
                                <CardContent className="pt-6">
                                    <div className="text-sm font-medium text-amber-600 mb-1">Pending</div>
                                    <div className="text-2xl font-bold text-amber-900">
                                        ${(revenueSummary.reduce((acc, s) => acc + s.pendingAmount, 0) / 100).toFixed(2)}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold">Revenue Tracking</h2>
                            <Button onClick={() => setShowRevenueDialog(true)}>
                                <Plus className="mr-2 h-4 w-4" /> Log Revenue
                            </Button>
                        </div>

                        <Card>
                            <CardHeader><CardTitle className="text-lg">Recent Records</CardTitle></CardHeader>
                            <CardContent className="p-0">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-muted text-muted-foreground font-medium border-b">
                                        <tr>
                                            <th className="p-4">Influencer</th>
                                            <th className="p-4">Amount</th>
                                            <th className="p-4">Period</th>
                                            <th className="p-4">Status</th>
                                            <th className="p-4">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {revenueRecords.map(rec => (
                                            <tr key={rec._id}>
                                                <td className="p-4 font-medium">{rec.influencer?.name}</td>
                                                <td className="p-4 font-bold">${(rec.amount / 100).toFixed(2)}</td>
                                                <td className="p-4 text-xs">
                                                    {new Date(rec.period.startDate).toLocaleDateString()} - {new Date(rec.period.endDate).toLocaleDateString()}
                                                </td>
                                                <td className="p-4">
                                                    {rec.isPaid ? (
                                                        <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">Paid</span>
                                                    ) : (
                                                        <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 text-xs">Pending</span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    {!rec.isPaid && (
                                                        <Button variant="outline" size="sm" onClick={() => handleMarkPaid(rec._id)}>Mark Paid</Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* MESSAGES TAB */}
                    <TabsContent value="messages">
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Messages</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {messages.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-8">No messages yet.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {messages.map((msg: any) => (
                                            <div key={msg._id} className="p-4 border rounded-lg bg-card group relative">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-semibold">{msg.name}</h4>
                                                        <p className="text-xs text-muted-foreground">{msg.email}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(msg.createdAt).toLocaleDateString()}
                                                        </span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 text-destructive hover:bg-destructive/10"
                                                            onClick={() => handleDeleteMessage(msg._id)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <p className="text-sm mt-2 bg-muted/50 p-3 rounded-md">{msg.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* SUBSCRIBERS TAB */}
                    <TabsContent value="subscribers">
                        <Card>
                            <CardHeader>
                                <CardTitle>Newsletter Subscribers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {subscribers.length === 0 ? (
                                    <p className="text-muted-foreground text-center py-8">No subscribers yet.</p>
                                ) : (
                                    <div className="border rounded-lg overflow-hidden">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-muted text-muted-foreground font-medium">
                                                <tr>
                                                    <th className="p-4">Email</th>
                                                    <th className="p-4">Joined Date</th>
                                                    <th className="p-4 w-[50px]">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y">
                                                {subscribers.map((sub: any) => (
                                                    <tr key={sub._id} className="hover:bg-muted/50 group">
                                                        <td className="p-4">{sub.email}</td>
                                                        <td className="p-4">{new Date(sub.createdAt).toLocaleDateString()}</td>
                                                        <td className="p-4">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                                onClick={() => handleDeleteSubscriber(sub._id)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* INFLUENCER DIALOG (Simple Overlay) */}
                {showInfluencerDialog && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <Card className="w-full max-w-md">
                            <CardHeader><CardTitle>{editingInfluencer ? 'Edit' : 'Add'} Influencer</CardTitle></CardHeader>
                            <CardContent>
                                <form onSubmit={handleSaveInfluencer} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-sm">Name</label>
                                        <Input value={infName} onChange={e => setInfName(e.target.value)} required />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm">Instagram ID (without @)</label>
                                        <Input value={infInstagram} onChange={e => setInfInstagram(e.target.value)} required />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm">Email</label>
                                        <Input value={infEmail} onChange={e => setInfEmail(e.target.value)} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm">Short Bio</label>
                                        <textarea className="w-full border rounded-md p-2 text-sm" value={infBio} onChange={e => setInfBio(e.target.value)} rows={3} />
                                    </div>
                                    <div className="flex gap-2 justify-end pt-4">
                                        <Button type="button" variant="outline" onClick={() => setShowInfluencerDialog(false)}>Cancel</Button>
                                        <Button type="submit">Save</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* REVENUE DIALOG */}
                {showRevenueDialog && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <Card className="w-full max-w-md">
                            <CardHeader><CardTitle>Log Ezoic Revenue</CardTitle></CardHeader>
                            <CardContent>
                                <form onSubmit={handleLogRevenue} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-sm">Influencer</label>
                                        <select className="w-full border rounded-md p-2" value={revInfluencerId} onChange={e => setRevInfluencerId(e.target.value)} required>
                                            <option value="">Select Influencer...</option>
                                            {influencers.map(inf => <option key={inf._id} value={inf._id}>{inf.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm">Amount ($)</label>
                                        <Input type="number" step="0.01" value={revAmount} onChange={e => setRevAmount(e.target.value)} required />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                            <label className="text-sm">Start Date</label>
                                            <Input type="date" value={revStartDate} onChange={e => setRevStartDate(e.target.value)} required />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm">End Date</label>
                                            <Input type="date" value={revEndDate} onChange={e => setRevEndDate(e.target.value)} required />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-sm">Notes</label>
                                        <Input value={revNotes} onChange={e => setRevNotes(e.target.value)} />
                                    </div>
                                    <div className="flex gap-2 justify-end pt-4">
                                        <Button type="button" variant="outline" onClick={() => setShowRevenueDialog(false)}>Cancel</Button>
                                        <Button type="submit">Submit</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

