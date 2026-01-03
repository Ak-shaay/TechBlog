import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';

interface ProfileEditorProps {
    initialData: any;
    onClose: () => void;
    onUpdate: () => void;
}

const ProfileEditor = ({ initialData, onClose, onUpdate }: ProfileEditorProps) => {
    const { token } = useAuth();
    const [bio, setBio] = useState(initialData.bio || '');
    const [avatar, setAvatar] = useState(initialData.avatar || '');
    const [socials, setSocials] = useState(initialData.socialLinks || {});
    const [loading, setLoading] = useState(false);

    const handleSocialChange = (key: string, value: string) => {
        setSocials({ ...socials, [key]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ bio, avatar, socialLinks: socials }),
            });

            if (res.ok) {
                toast.success('Profile updated');
                onUpdate();
                onClose();
            } else {
                toast.error('Failed to update profile');
            }
        } catch (error) {
            toast.error('Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Avatar URL</label>
                            <Input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Bio</label>
                            <textarea
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell us about yourself"
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Social Links</label>
                            {['linkedin', 'twitter', 'github', 'instagram', 'facebook', 'youtube'].map((platform) => (
                                <Input
                                    key={platform}
                                    value={socials[platform] || ''}
                                    onChange={(e) => handleSocialChange(platform, e.target.value)}
                                    placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                                    className="mb-2"
                                />
                            ))}
                        </div>
                        <div className="flex gap-2 justify-end mt-4">
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfileEditor;
