import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RotateCcw, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { useChatStore } from '../stores/chatStore';
import { chatConfigSchema, type ChatConfigFormData } from '../schemas/chatConfigSchema';

interface ChatSettingsProps {
  onClose: () => void;
}

const ChatSettings: React.FC<ChatSettingsProps> = ({ onClose }) => {
  const { config, updateConfig, resetConfig } = useChatStore();

  const form = useForm<ChatConfigFormData>({
    resolver: zodResolver(chatConfigSchema),
    defaultValues: {
      responseStyle: config.responseStyle,
      detailLevel: config.detailLevel,
      includeExamples: config.includeExamples,
      includeCaseLaw: config.includeCaseLaw,
      includeProcedures: config.includeProcedures,
      language: config.language,
      focusArea: config.focusArea,
      responseLength: config.responseLength,
    },
  });

  const onSubmit = (data: ChatConfigFormData) => {
    updateConfig(data);
    onClose();
  };

  const handleReset = () => {
    resetConfig();
    form.reset({
      responseStyle: 'formal',
      detailLevel: 'moderate',
      includeExamples: true,
      includeCaseLaw: true,
      includeProcedures: true,
      language: 'english',
      focusArea: 'all',
      responseLength: 'medium',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg sm:text-xl text-foreground">Chat Configuration</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="text-xs w-full sm:w-auto border-border text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 sm:space-y-6">
          <CardDescription className="text-sm text-muted-foreground">
            Customize how the AI responds to your legal questions. These settings will be applied to all future responses.
          </CardDescription>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="responseStyle" className="text-sm text-foreground">Response Style</Label>
                <Select
                  value={form.watch('responseStyle')}
                  onValueChange={(value) => form.setValue('responseStyle', value as 'formal' | 'casual' | 'academic' | 'practical')}
                >
                  <SelectTrigger className="text-sm bg-background border-border text-foreground focus:border-primary">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="formal" className="text-foreground hover:bg-accent">Formal</SelectItem>
                    <SelectItem value="casual" className="text-foreground hover:bg-accent">Casual</SelectItem>
                    <SelectItem value="academic" className="text-foreground hover:bg-accent">Academic</SelectItem>
                    <SelectItem value="practical" className="text-foreground hover:bg-accent">Practical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="detailLevel" className="text-sm text-foreground">Detail Level</Label>
                <Select
                  value={form.watch('detailLevel')}
                  onValueChange={(value) => form.setValue('detailLevel', value as 'brief' | 'moderate' | 'comprehensive')}
                >
                  <SelectTrigger className="text-sm bg-background border-border text-foreground focus:border-primary">
                    <SelectValue placeholder="Select detail level" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="brief" className="text-foreground hover:bg-accent">Brief</SelectItem>
                    <SelectItem value="moderate" className="text-foreground hover:bg-accent">Moderate</SelectItem>
                    <SelectItem value="comprehensive" className="text-foreground hover:bg-accent">Comprehensive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language" className="text-sm text-foreground">Language</Label>
                <Select
                  value={form.watch('language')}
                  onValueChange={(value) => form.setValue('language', value as 'english' | 'swahili' | 'bilingual')}
                >
                  <SelectTrigger className="text-sm bg-background border-border text-foreground focus:border-primary">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="english" className="text-foreground hover:bg-accent">English</SelectItem>
                    <SelectItem value="swahili" className="text-foreground hover:bg-accent">Swahili</SelectItem>
                    <SelectItem value="bilingual" className="text-foreground hover:bg-accent">Bilingual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="focusArea" className="text-sm text-foreground">Focus Area</Label>
                <Select
                  value={form.watch('focusArea')}
                  onValueChange={(value) => form.setValue('focusArea', value as 'constitutional' | 'criminal' | 'civil' | 'family' | 'land' | 'employment' | 'all')}
                >
                  <SelectTrigger className="text-sm bg-background border-border text-foreground focus:border-primary">
                    <SelectValue placeholder="Select focus area" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="constitutional" className="text-foreground hover:bg-accent">Constitutional</SelectItem>
                    <SelectItem value="criminal" className="text-foreground hover:bg-accent">Criminal</SelectItem>
                    <SelectItem value="civil" className="text-foreground hover:bg-accent">Civil</SelectItem>
                    <SelectItem value="family" className="text-foreground hover:bg-accent">Family</SelectItem>
                    <SelectItem value="land" className="text-foreground hover:bg-accent">Land</SelectItem>
                    <SelectItem value="employment" className="text-foreground hover:bg-accent">Employment</SelectItem>
                    <SelectItem value="all" className="text-foreground hover:bg-accent">All Areas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="responseLength" className="text-sm text-foreground">Response Length</Label>
                <Select
                  value={form.watch('responseLength')}
                  onValueChange={(value) => form.setValue('responseLength', value as 'short' | 'medium' | 'long')}
                >
                  <SelectTrigger className="text-sm bg-background border-border text-foreground focus:border-primary">
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="short" className="text-foreground hover:bg-accent">Short</SelectItem>
                    <SelectItem value="medium" className="text-foreground hover:bg-accent">Medium</SelectItem>
                    <SelectItem value="long" className="text-foreground hover:bg-accent">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 sm:space-y-4">
              <Label className="text-base font-medium text-foreground">Response Options</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeExamples"
                    checked={form.watch('includeExamples')}
                    onCheckedChange={(checked) => form.setValue('includeExamples', checked as boolean)}
                    className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="includeExamples" className="text-sm text-muted-foreground">Include Examples</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeCaseLaw"
                    checked={form.watch('includeCaseLaw')}
                    onCheckedChange={(checked) => form.setValue('includeCaseLaw', checked as boolean)}
                    className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="includeCaseLaw" className="text-sm text-muted-foreground">Include Case Law</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeProcedures"
                    checked={form.watch('includeProcedures')}
                    onCheckedChange={(checked) => form.setValue('includeProcedures', checked as boolean)}
                    className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <Label htmlFor="includeProcedures" className="text-sm text-muted-foreground">Include Procedures</Label>
                </div>
              </div>
            </div>

            {/* Current Configuration Summary */}
            <Card className="bg-muted/50 border-border">
              <CardContent className="pt-3 sm:pt-4">
                <Label className="text-sm font-medium text-foreground">Current Settings</Label>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {form.watch('responseStyle')} style • {form.watch('detailLevel')} detail • {form.watch('language')} language • {form.watch('focusArea')} focus • {form.watch('responseLength')} responses
                  {form.watch('includeExamples') && ' • with examples'}
                  {form.watch('includeCaseLaw') && ' • with case law'}
                  {form.watch('includeProcedures') && ' • with procedures'}
                </p>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full sm:w-auto border-border text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                Cancel
              </Button>
              <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
                Save Configuration
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatSettings;
