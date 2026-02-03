'use client';

import { useState } from 'react';
import { MessageSquare, Check, X, ChevronDown } from 'lucide-react';
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
    <div className="px-0 py-2 bg-white border-b border-gray-200">
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="w-full flex items-center gap-3 text-left hover:bg-gray-50 transition-colors rounded-lg p-3 -mx-3"
        >
          <MessageSquare className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <span className="flex-1 min-w-0 text-sm text-gray-900 text-left">
            {note || 'Tambahkan catatan (opsional)'}
          </span>
          <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
        </button>
      ) : (
        <div className="py-2">
          <Textarea
            value={tempNote}
            onChange={(e) => setTempNote(e.target.value)}
            placeholder="Contoh: Tolong kirim bubble wrap ekstra"
            className="min-h-[80px] resize-none text-sm text-gray-900 placeholder:text-gray-400"
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
                className="border border-[#FF2442] bg-white text-[#FF2442] hover:bg-[#FFF0F3] px-4"
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
