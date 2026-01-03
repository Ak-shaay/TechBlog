import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Trash2, Edit, Plus, User as UserIcon, Mail, Users, FileText, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const POSTS_PER_PAGE = 5;

const Dashboard = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Data States
    const [blogs, setBlogs] = useState<any[]>([]);
    const [messages, setMessages] = useState<any[]>([]);
    const [subscribers, setSubscribers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Blog Filter States
    const [blogSearch, setBlogSearch] = useState('');
    const [blogPage, setBlogPage] = useState(1);

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
            await Promise.all([fetchBlogs(), fetchMessages(), fetchSubscribers()]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
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
                    <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
                        <TabsTrigger value="blogs" className="flex gap-2"><FileText className="w-4 h-4" /> Blogs</TabsTrigger>
                        <TabsTrigger value="messages" className="flex gap-2"><Mail className="w-4 h-4" /> Messages</TabsTrigger>
                        <TabsTrigger value="subscribers" className="flex gap-2"><Users className="w-4 h-4" /> Subscribers</TabsTrigger>
                    </TabsList>

                    {/* BLOGS TAB */}
                    <TabsContent value="blogs" className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search blogs..."
                                    className="pl-8"
                                    value={blogSearch}
                                    onChange={(e) => { setBlogSearch(e.target.value); setBlogPage(1); }}
                                />
                            </div>
                            <Link to="/dashboard/new">
                                <Button><Plus className="mr-2 h-4 w-4" /> Create New</Button>
                            </Link>
                        </div>

                        <Card>
                            <CardContent className="p-0">
                                {loading ? (
                                    <div className="p-8 text-center text-muted-foreground">Loading...</div>
                                ) : filteredBlogs.length === 0 ? (
                                    <div className="p-12 text-center text-muted-foreground">
                                        No blogs found.
                                    </div>
                                ) : (
                                    <div className="divide-y">
                                        {paginatedBlogs.map(blog => (
                                            <div key={blog._id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4 hover:bg-muted/50 transition-colors">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                            {blog.category || 'General'}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(blog.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <h3 className="font-semibold text-lg">{blog.title}</h3>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Link to={`/dashboard/edit/${blog._id}`}>
                                                        <Button variant="ghost" size="icon" className="hover:text-blue-600"><Edit className="h-4 w-4" /></Button>
                                                    </Link>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(blog._id)} className="text-destructive hover:bg-red-50">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setBlogPage(p => Math.max(1, p - 1))}
                                    disabled={blogPage === 1}
                                >
                                    Previous
                                </Button>
                                <span className="flex items-center px-4 text-sm font-medium">
                                    Page {blogPage} of {totalPages}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setBlogPage(p => Math.min(totalPages, p + 1))}
                                    disabled={blogPage === totalPages}
                                >
                                    Next
                                </Button>
                            </div>
                        )}
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
            </div>
        </div>
    );
};

export default Dashboard;

