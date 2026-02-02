'use client';

import { useState } from 'react';
import { MessageSquare, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface SellerNoteProps {
  note: string;
  onChange: (note: string) => void;
}

export default function SellerNote({ note, onChange }: SellerNoteProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempNote, setTempNote] = useState(note);

  const handleSave = () => {
    onChange(tempNote);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempNote(note);
    setIsEditing(false);
  };

  return (
    <div className="py-4">
      <h3 className="text-[15px] font-semibold text-gray-900">Catatan untuk Penjual</h3>

      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors text-left"
        >
          <MessageSquare className="h-5 w-5 text-gray-400" />
          <span className="flex-1 text-sm text-gray-500">
            {note || 'Tambahkan catatan (opsional)'}
          </span>
        </button>
      ) : (
        <div className="py-2">
          <Textarea
            value={tempNote}
            onChange={(e) => setTempNote(e.target.value)}
            placeholder="Contoh: Tolong kirim bubble wrap ekstra"
            className="min-h-[80px] resize-none text-sm"
            maxLength={200}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {tempNote.length}/200 karakter
            </span>
            <div className="py-2 flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-gray-600"
              >
                <X className="h-4 w-4 mr-1" />
                Batal
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-[#FF2442] hover:bg-[#E61E3A]"
              >
                <Check className="h-4 w-4 mr-1" />
                Simpan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
