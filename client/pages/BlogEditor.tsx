import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import SEO from '@/components/SEO';

const CATEGORIES = ["General", "Web Development", "AI & Machine Learning", "Data Science", "Mobile Development", "DevOps", "Cybersecurity", "Blockchain"];

const BlogEditor = () => {
    const { id } = useParams();
    const isEdit = !!id;
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('General');
    const [image, setImage] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [influencers, setInfluencers] = useState<any[]>([]);
    const [selectedInfluencerId, setSelectedInfluencerId] = useState('');

    // Author Details State
    const [authorName, setAuthorName] = useState('');
    const [authorAvatar, setAuthorAvatar] = useState('');
    const [authorBio, setAuthorBio] = useState('');
    const [authorSocials, setAuthorSocials] = useState({
        linkedin: '',
        twitter: '',
        github: '',
        instagram: '',
        facebook: '',
        youtube: ''
    });

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        // Fetch Influencers
        fetch('/api/influencers')
            .then(res => res.json())
            .then(data => setInfluencers(data))
            .catch(() => toast.error('Error loading influencers'));

        if (isEdit) {
            fetch(`/api/blogs/${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        toast.error(data.error);
                        navigate('/dashboard');
                    } else {
                        setTitle(data.title);
                        setContent(data.content);
                        setCategory(data.category || 'General');
                        setImage(data.image || '');
                        setExcerpt(data.excerpt || '');
                        setAuthorName(data.authorName || '');
                        setAuthorAvatar(data.authorAvatar || '');
                        setAuthorBio(data.authorBio || '');
                        setAuthorSocials(data.authorSocials || {
                            linkedin: '', twitter: '', github: '', instagram: '', facebook: '', youtube: ''
                        });
                        if (data.influencer) {
                            setSelectedInfluencerId(typeof data.influencer === 'object' ? data.influencer._id : data.influencer);
                        }
                    }
                })
                .catch(() => toast.error('Error loading blog'));
        }
    }, [id, isAuthenticated, navigate]);

    const handleInfluencerChange = (influencerId: string) => {
        setSelectedInfluencerId(influencerId);
        const influencer = influencers.find(i => i._id === influencerId);
        if (influencer) {
            setAuthorName(influencer.name);
            setAuthorAvatar(influencer.avatar || '');
            setAuthorBio(influencer.bio || '');
            setAuthorSocials({
                linkedin: influencer.socials?.linkedin || '',
                twitter: influencer.socials?.twitter || '',
                github: influencer.socials?.github || '',
                instagram: influencer.socials?.instagram || '',
                facebook: influencer.socials?.facebook || '',
                youtube: influencer.socials?.youtube || ''
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const endpoint = isEdit ? `/api/blogs/${id}` : '/api/blogs';
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const res = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    title,
                    content,
                    category,
                    image,
                    excerpt,
                    authorName,
                    authorAvatar,
                    authorBio,
                    authorSocials,
                    influencer: selectedInfluencerId || undefined
                }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(isEdit ? 'Blog updated' : 'Blog created');
                navigate('/dashboard');
            } else {
                toast.error(data.error || 'Error saving blog');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    return (
        <div className="container mx-auto p-8 max-w-3xl">
            <SEO title={isEdit ? "Edit Blog" : "Create Blog"} description="Admin blog editor" noIndex={true} />
            <Card>
                <CardHeader>
                    <CardTitle>{isEdit ? 'Edit Blog' : 'Create New Blog'}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                    placeholder="Blog Title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <select
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2 p-4 border rounded-md bg-primary/5">
                            <label className="text-sm font-semibold block mb-2">Assign to Influencer (Optional)</label>
                            <p className="text-xs text-muted-foreground mb-3">Selecting an influencer will auto-populate author details and set up the Ezoic tracking URL structure.</p>
                            <select
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                                value={selectedInfluencerId}
                                onChange={(e) => handleInfluencerChange(e.target.value)}
                            >
                                <option value="">No Influencer (Direct Post)</option>
                                {influencers.map(inf => (
                                    <option key={inf._id} value={inf._id}>{inf.name} ({inf.slug})</option>
                                ))}
                            </select>
                        </div>

                        {/* Author Section */}
                        <div className="p-4 border rounded-md space-y-4 bg-secondary/20">
                            <h3 className="font-semibold text-sm">Author Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Author Name</label>
                                    <Input
                                        placeholder="Full Name"
                                        value={authorName}
                                        onChange={(e) => setAuthorName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Author Avatar URL</label>
                                    <Input
                                        placeholder="https://..."
                                        value={authorAvatar}
                                        onChange={(e) => setAuthorAvatar(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Author Bio</label>
                                <Input
                                    placeholder="Short bio for the author"
                                    value={authorBio}
                                    onChange={(e) => setAuthorBio(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Social Links</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <Input placeholder="LinkedIn URL" value={authorSocials.linkedin} onChange={(e) => setAuthorSocials({ ...authorSocials, linkedin: e.target.value })} />
                                    <Input placeholder="Twitter URL" value={authorSocials.twitter} onChange={(e) => setAuthorSocials({ ...authorSocials, twitter: e.target.value })} />
                                    <Input placeholder="GitHub URL" value={authorSocials.github} onChange={(e) => setAuthorSocials({ ...authorSocials, github: e.target.value })} />
                                    <Input placeholder="Instagram URL" value={authorSocials.instagram} onChange={(e) => setAuthorSocials({ ...authorSocials, instagram: e.target.value })} />
                                    <Input placeholder="Facebook URL" value={authorSocials.facebook} onChange={(e) => setAuthorSocials({ ...authorSocials, facebook: e.target.value })} />
                                    <Input placeholder="YouTube URL" value={authorSocials.youtube} onChange={(e) => setAuthorSocials({ ...authorSocials, youtube: e.target.value })} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Cover Image URL</label>
                            <Input
                                placeholder="https://example.com/image.jpg"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Excerpt (Short Summary)</label>
                            <textarea
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Brief overview of the post..."
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                rows={2}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Content (Markdown Supported)</label>
                            <div className="flex flex-wrap gap-2 mb-2 p-2 bg-secondary/30 rounded-md">
                                <Button type="button" variant="outline" size="sm" onClick={() => setContent(prev => prev + '\n## New Subheading\n')}>H2</Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => setContent(prev => prev + '\n### New Section\n')}>H3</Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => setContent(prev => prev + '**Bold Text** ')}>Bold</Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => setContent(prev => prev + '*Italic Text* ')}>Italic</Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => setContent(prev => prev + '\n- List item 1\n- List item 2\n- List item 3\n')}>Bullet List</Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => setContent(prev => prev + '\n1. First item\n2. Second item\n3. Third item\n')}>Numbered List</Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => setContent(prev => prev + '\n![Image Description](https://example.com/image.jpg)\n')}>Insert Image</Button>
                                <Button type="button" variant="outline" size="sm" onClick={() => setContent(prev => prev + '\n| Header 1 | Header 2 |\n| -------- | -------- |\n| Row 1    | Data     |\n| Row 2    | Data     |\n')}>Table</Button>
                            </div>
                            <textarea
                                placeholder="Write your blog content here... Use Markdown for styling."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                required
                                className="flex min-h-[400px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                            />
                        </div>
                        <div className="flex gap-4">
                            <Button type="submit">{isEdit ? 'Update' : 'Publish'}</Button>
                            <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>Cancel</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default BlogEditor;
