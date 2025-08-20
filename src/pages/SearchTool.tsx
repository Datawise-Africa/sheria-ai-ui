import React, { useState, useEffect } from 'react';
import { 
  Search, 
  BookOpen, 
  MessageSquare, 
  Save, 
  Download, 
  ChevronDown,
  ChevronUp,
  X,
  Star,
  Eye,
  ExternalLink,
  Copy,
  Loader2,
  AlertCircle,
  User,
  Building,
  Tag,
  Plus
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Checkbox } from '../components/ui/checkbox';
import { Slider } from '../components/ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';

interface Case {
  id: string;
  title: string;
  citation: string;
  court: string;
  year: number;
  judge: string;
  summary: string;
  topics: string[];
  keywords: string[];
  content: string;
  saved: boolean;
}

interface SearchFilters {
  query: string;
  judges: string[];
  courts: string[];
  yearRange: [number, number];
  topics: string[];
  scope: 'all' | 'judgments' | 'rulings' | 'petitions';
}

const SearchTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'results' | 'chat'>('results');
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    query: '',
    judges: [],
    courts: [],
    yearRange: [1990, 2024],
    topics: [],
    scope: 'all'
  });
  const [searchResults, setSearchResults] = useState<Case[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [showCaseDrawer, setShowCaseDrawer] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    judges: false,
    courts: false,
    topics: false
  });

  // Mock data for demonstration
  const mockCases: Case[] = [
    {
      id: '1',
      title: 'Republic v John Doe',
      citation: '[2015] eKLR',
      court: 'High Court',
      year: 2015,
      judge: 'Hon. Justice Wanjiku',
      summary: 'The court considered whether the prosecution had established a prima facie case against the accused person...',
      topics: ['Criminal Law', 'Evidence', 'Bail'],
      keywords: ['prosecution', 'prima facie', 'accused', 'bail'],
      content: 'Full case content would go here...',
      saved: false
    },
    {
      id: '2',
      title: 'Jane Smith v County Government',
      citation: '[2018] eKLR',
      court: 'Court of Appeal',
      year: 2018,
      judge: 'Hon. Justice Ochieng',
      summary: 'This appeal concerned the interpretation of constitutional provisions regarding property rights...',
      topics: ['Constitutional Law', 'Property Rights', 'Local Government'],
      keywords: ['constitutional', 'property', 'rights', 'local government'],
      content: 'Full case content would go here...',
      saved: false
    },
    {
      id: '3',
      title: 'ABC Company v XYZ Corporation',
      citation: '[2020] eKLR',
      court: 'Supreme Court',
      year: 2020,
      judge: 'Hon. Chief Justice Maraga',
      summary: 'The Supreme Court examined the scope of commercial arbitration agreements...',
      topics: ['Commercial Law', 'Arbitration', 'Contract Law'],
      keywords: ['commercial', 'arbitration', 'contract', 'agreement'],
      content: 'Full case content would go here...',
      saved: false
    }
  ];

  const mockJudges = ['Hon. Justice Wanjiku', 'Hon. Justice Ochieng', 'Hon. Chief Justice Maraga', 'Hon. Justice Kimani'];
  const mockCourts = ['Supreme Court', 'Court of Appeal', 'High Court', 'Employment Court', 'Environment Court'];
  const mockTopics = ['Criminal Law', 'Civil Law', 'Constitutional Law', 'Commercial Law', 'Family Law', 'Land Law', 'Employment Law', 'Environmental Law'];

  const [chatMessages, setChatMessages] = useState<Array<{
    id: string;
    role: 'user' | 'assistant';
    content: string;
    citations?: string[];
    timestamp: Date;
  }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    // Simulate search results
    if (searchFilters.query) {
      setIsSearching(true);
      setTimeout(() => {
        setSearchResults(mockCases.filter(case_ => 
          case_.title.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
          case_.citation.toLowerCase().includes(searchFilters.query.toLowerCase()) ||
          case_.judge.toLowerCase().includes(searchFilters.query.toLowerCase())
        ));
        setIsSearching(false);
      }, 1000);
    } else {
      setSearchResults([]);
    }
  }, [searchFilters.query]);

  const handleSearch = () => {
    if (!searchFilters.query.trim()) return;
    // Search logic would go here
  };

  const handleSaveCase = (caseId: string) => {
    setSearchResults(prev => prev.map(case_ => 
      case_.id === caseId ? { ...case_, saved: !case_.saved } : case_
    ));
  };

  const handleOpenCase = (case_: Case) => {
    setSelectedCase(case_);
    setShowCaseDrawer(true);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      // Simulate AI response with citations
      setTimeout(() => {
        const aiResponse = {
          id: (Date.now() + 1).toString(),
          role: 'assistant' as const,
          content: `Based on the search results, here's what I found regarding your query: "${chatInput}"\n\nIn Republic v John Doe [2015] eKLR, the court established important principles about prima facie cases. The judgment clarified that...\n\nAdditionally, in Jane Smith v County Government [2018] eKLR, the Court of Appeal provided guidance on...`,
          citations: ['Republic v John Doe [2015] eKLR', 'Jane Smith v County Government [2018] eKLR'],
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, aiResponse]);
        setIsChatLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error getting AI response:', error);
      setIsChatLoading(false);
    }
  };

  const copyCitation = (citation: string) => {
    navigator.clipboard.writeText(citation);
    // Show toast notification
  };

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                <BookOpen className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-primary">
                SheriaAI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700">
                <Plus className="h-4 w-4 mr-2" />
                New Search
              </Button>
              <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700">
                <Star className="h-4 w-4 mr-2" />
                Saved
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700">
              <User className="h-4 w-4 mr-2" />
              Account
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-5rem)]">
        {/* Left Panel - Search & Filters */}
        <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* Global Search */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Search Cases</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <Input
                  placeholder="Search by case name, citation, judge, year, topic..."
                  value={searchFilters.query}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, query: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-red-500 dark:focus:border-red-400"
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Search
              </Button>
            </div>

            {/* Quick Scopes */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Scopes</h4>
              <div className="flex flex-wrap gap-2">
                {(['all', 'judgments', 'rulings', 'petitions'] as const).map((scope) => (
                  <Button
                    key={scope}
                    variant={searchFilters.scope === scope ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSearchFilters(prev => ({ ...prev, scope }))}
                    className={
                      searchFilters.scope === scope
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                        : 'border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }
                  >
                    {scope.charAt(0).toUpperCase() + scope.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters</h4>
              
              {/* Judge Filter */}
              <Collapsible open={expandedFilters.judges} onOpenChange={(open) => setExpandedFilters(prev => ({ ...prev, judges: open }))}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-2 h-auto text-muted-foreground hover:text-primary hover:bg-accent">
                    <span className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Judge
                    </span>
                    {expandedFilters.judges ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pl-4">
                  {mockJudges.map((judge) => (
                    <div key={judge} className="flex items-center space-x-2">
                      <Checkbox
                        id={`judge-${judge}`}
                        checked={searchFilters.judges.includes(judge)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSearchFilters(prev => ({ ...prev, judges: [...prev.judges, judge] }));
                          } else {
                            setSearchFilters(prev => ({ ...prev, judges: prev.judges.filter(j => j !== judge) }));
                          }
                        }}
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label htmlFor={`judge-${judge}`} className="text-sm text-foreground cursor-pointer">{judge}</label>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Court Filter */}
              <Collapsible open={expandedFilters.courts} onOpenChange={(open) => setExpandedFilters(prev => ({ ...prev, courts: open }))}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-2 h-auto text-muted-foreground hover:text-primary hover:bg-accent">
                    <span className="flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      Court
                    </span>
                    {expandedFilters.courts ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pl-4">
                  {mockCourts.map((court) => (
                    <div key={court} className="flex items-center space-x-2">
                      <Checkbox
                        id={`court-${court}`}
                        checked={searchFilters.courts.includes(court)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSearchFilters(prev => ({ ...prev, courts: [...prev.courts, court] }));
                          } else {
                            setSearchFilters(prev => ({ ...prev, courts: prev.courts.filter(c => c !== court) }));
                          }
                        }}
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label htmlFor={`court-${court}`} className="text-sm text-foreground cursor-pointer">{court}</label>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>

              {/* Year Range */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Year Range</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {searchFilters.yearRange[0]} - {searchFilters.yearRange[1]}
                  </span>
                </div>
                <Slider
                  value={searchFilters.yearRange}
                  onValueChange={(value: number[]) => setSearchFilters(prev => ({ ...prev, yearRange: value as [number, number] }))}
                  max={2024}
                  min={1990}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Topics Filter */}
              <Collapsible open={expandedFilters.topics} onOpenChange={(open) => setExpandedFilters(prev => ({ ...prev, topics: open }))}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between p-2 h-auto text-muted-foreground hover:text-primary hover:bg-accent">
                    <span className="flex items-center">
                      <Tag className="h-4 w-4 mr-2" />
                      Topics
                    </span>
                    {expandedFilters.topics ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="space-y-2 pl-4">
                  {mockTopics.map((topic) => (
                    <div key={topic} className="flex items-center space-x-2">
                      <Checkbox
                        id={`topic-${topic}`}
                        checked={searchFilters.topics.includes(topic)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSearchFilters(prev => ({ ...prev, topics: [...prev.topics, topic] }));
                          } else {
                            setSearchFilters(prev => ({ ...prev, topics: prev.topics.filter(t => t !== topic) }));
                          }
                        }}
                        className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label htmlFor={`topic-${topic}`} className="text-sm text-foreground cursor-pointer">{topic}</label>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </div>

            {/* Save Filters */}
            <Button variant="outline" className="w-full border-border text-foreground hover:bg-accent hover:text-accent-foreground">
              <Save className="h-4 w-4 mr-2" />
              Save Current Filter Set
            </Button>

            {/* Recent Searches */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Recent Searches</h4>
              <div className="space-y-2">
                {['bail pending appeal', 'property rights', 'employment termination'].map((search, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-muted-foreground hover:text-primary hover:bg-accent text-xs"
                  >
                    <Search className="h-3 w-3 mr-2" />
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Results & Chat */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'results' | 'chat')} className="h-full">
            <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="px-6 py-4">
                <TabsList className="bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                  <TabsTrigger 
                    value="results" 
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Results ({searchResults.length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="chat"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    AI Chat
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            <TabsContent value="results" className="flex-1 p-6 overflow-y-auto">
              {isSearching ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((case_) => (
                    <Card key={case_.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-red-300 dark:hover:border-red-600 transition-all duration-200 hover:shadow-md">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg text-gray-900 dark:text-white mb-2">{case_.title}</CardTitle>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                              <span className="font-mono">{case_.citation}</span>
                              <span>{case_.court}</span>
                              <span>{case_.year}</span>
                              <span>{case_.judge}</span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{case_.summary}</p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSaveCase(case_.id)}
                              className={`h-8 w-8 p-0 ${case_.saved ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-500'} hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-gray-700`}
                            >
                              <Star className={`h-4 w-4 ${case_.saved ? 'fill-current' : ''}`} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenCase(case_)}
                              className="h-8 w-8 p-0 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {case_.topics.map((topic) => (
                              <Badge key={topic} variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenCase(case_)}
                              className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400"
                            >
                              Preview
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleOpenCase(case_)}
                              className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white"
                            >
                              Open
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : searchFilters.query ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-300 dark:border-gray-600">
                    <Search className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No results found</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">Try adjusting your search terms or filters</p>
                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <p>• Try searching by judge name or year</p>
                    <p>• Use broader topic categories</p>
                    <p>• Check your spelling</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-300 dark:border-gray-600">
                    <BookOpen className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Start your search</h3>
                  <p className="text-gray-600 dark:text-gray-300">Enter a case name, citation, or topic to begin searching Kenyan case law</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="chat" className="flex-1 flex flex-col p-6">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-300 dark:border-gray-600">
                      <MessageSquare className="h-8 w-8 text-red-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ask about your search results</h3>
                    <p className="text-gray-600 dark:text-gray-300">Get AI-powered insights and explanations about the cases you've found</p>
                  </div>
                ) : (
                  chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`rounded-lg px-4 py-3 ${
                            message.role === 'user'
                              ? 'bg-red-600 dark:bg-red-500 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{message.content}</p>
                          
                          {message.citations && message.citations.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-opacity-20 border-current">
                              <p className="text-xs opacity-70 mb-2">Citations:</p>
                              <div className="space-y-1">
                                {message.citations.map((citation, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-white/10 rounded text-xs">
                                    <span className="truncate">{citation}</span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyCitation(citation)}
                                      className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/20"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-lg px-4 py-3 border border-slate-700/50">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-teal-400" />
                        <span className="text-slate-300">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <form onSubmit={handleChatSubmit} className="flex space-x-3">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about the cases, get explanations, or request summaries..."
                    className="flex-1 bg-background border-border text-foreground placeholder-muted-foreground focus:border-primary focus:ring-primary"
                  />
                  <Button
                    type="submit"
                    disabled={isChatLoading || !chatInput.trim()}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </form>
                
                {/* Chat Toolbar */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-accent hover:text-accent-foreground text-xs">
                      Insert Selected Cases
                    </Button>
                    <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-accent hover:text-accent-foreground text-xs">
                      Summarize Top 5
                    </Button>
                    <Button variant="outline" size="sm" className="border-border text-foreground hover:bg-accent hover:text-accent-foreground text-xs">
                      Explain Precedent
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                    <AlertCircle className="h-3 w-3" />
                    Verify citations before filing
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Case Detail Drawer */}
      {showCaseDrawer && selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCaseDrawer(false)} />
          <div className="relative w-96 h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Case Details</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCaseDrawer(false)}
                  className="h-8 w-8 p-0 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Metadata */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{selectedCase.title}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 dark:text-gray-400">Citation:</span>
                      <span className="text-gray-900 dark:text-white font-mono">{selectedCase.citation}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 dark:text-gray-400">Court:</span>
                      <span className="text-gray-900 dark:text-white">{selectedCase.court}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 dark:text-gray-400">Year:</span>
                      <span className="text-gray-900 dark:text-white">{selectedCase.year}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500 dark:text-gray-400">Judge:</span>
                      <span className="text-gray-900 dark:text-white">{selectedCase.judge}</span>
                    </div>
                  </div>
                </div>

                {/* Topics */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCase.topics.map((topic) => (
                      <Badge key={topic} variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Summary</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{selectedCase.summary}</p>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400"
                    onClick={() => handleSaveCase(selectedCase.id)}
                  >
                    <Star className={`h-4 w-4 mr-2 ${selectedCase.saved ? 'fill-current text-yellow-500' : ''}`} />
                    {selectedCase.saved ? 'Saved' : 'Save Case'}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400"
                    onClick={() => copyCitation(selectedCase.citation)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Citation
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchTool;
