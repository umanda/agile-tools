'use client';

import React, { useState } from 'react';
import { Badge } from '@/registry/new-york-v4/ui/badge';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/registry/new-york-v4/ui/card';
import { Calculator, RotateCcw, Clock, Target, Calendar } from 'lucide-react';

const StoryPointsEstimator = () => {
  const [estimationType, setEstimationType] = useState('story_points'); // 'story_points' or 'days'
  const [responses, setResponses] = useState({
    dependencies: null,
    knowledge: null,
    repetition: null,
    complexity: null,
    risk: null,
    duration: null
  });

  const [storyPoints, setStoryPoints] = useState(null);
  const [dayEstimate, setDayEstimate] = useState(null);
  const [showResult, setShowResult] = useState(false);
  
  // Time estimation settings
  const [timeEstimation, setTimeEstimation] = useState({
    teamVelocity: 20, // story points per sprint
    sprintLength: 10, // working days
    bufferPercentage: 20,
    workingHoursPerDay: 8
  });

  const [showTimeEstimation, setShowTimeEstimation] = useState(false);
  const [timeResults, setTimeResults] = useState(null);

  const questions = [
    {
      id: 'dependencies',
      title: 'Dependencies',
      description: 'Does this feature rely on other stories or epics that are currently open or in progress?',
      options: [
        { value: 1, label: 'None', weight: 1 },
        { value: 2, label: 'Few', weight: 2 },
        { value: 3, label: 'Many', weight: 3 }
      ]
    },
    {
      id: 'knowledge',
      title: 'Knowledge',
      description: "What is the assignee's familiarity with the story's requirements and context?",
      options: [
        { value: 3, label: 'Nothing', weight: 3 },
        { value: 2, label: 'Something', weight: 2 },
        { value: 1, label: 'Everything', weight: 1 }
      ]
    },
    {
      id: 'repetition',
      title: 'Repetition',
      description: 'How often has the assignee performed a similar story in the past?',
      options: [
        { value: 3, label: 'Never', weight: 3 },
        { value: 2, label: 'Few', weight: 2 },
        { value: 1, label: 'Many', weight: 1 }
      ]
    },
    {
      id: 'complexity',
      title: 'Complexity',
      description: 'To what extent is the story challenging or intricate to accomplish?',
      options: [
        { value: 1, label: 'Easy', weight: 1 },
        { value: 2, label: 'Medium', weight: 2 },
        { value: 3, label: 'Hard', weight: 3 }
      ]
    },
    {
      id: 'risk',
      title: 'Risk',
      description: "What is the level of potential risks associated with the story's completion?",
      options: [
        { value: 1, label: 'Low', weight: 1 },
        { value: 2, label: 'Medium', weight: 2 },
        { value: 3, label: 'High', weight: 3 }
      ]
    },
    {
      id: 'duration',
      title: 'Duration',
      description: 'What is the expected time frame for completing the story?',
      options: [
        { value: 1, label: 'Minutes', weight: 1 },
        { value: 2, label: 'Hours', weight: 2 },
        { value: 3, label: 'Days', weight: 3 }
      ]
    }
  ];

  const handleOptionSelect = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
    setShowResult(false);
    setStoryPoints(null);
    setDayEstimate(null);
  };

  const calculateEstimation = () => {
    const allAnswered = Object.values(responses).every(response => response !== null);
    
    if (!allAnswered) {
      alert('Please answer all questions before calculating.');
      return;
    }

    const totalScore = Object.values(responses).reduce((sum, value) => sum + value, 0);
    
    if (estimationType === 'story_points') {
      // Story Points calculation (Fibonacci sequence)
      let points;
      if (totalScore <= 8) points = 1;
      else if (totalScore <= 10) points = 2;
      else if (totalScore <= 12) points = 3;
      else if (totalScore <= 14) points = 5;
      else if (totalScore <= 16) points = 8;
      else if (totalScore <= 17) points = 13;
      else points = 21;
      
      setStoryPoints(points);
    } else {
      // Days estimation based on score
      let days;
      if (totalScore <= 8) days = 0.5;
      else if (totalScore <= 10) days = 1;
      else if (totalScore <= 12) days = 2;
      else if (totalScore <= 14) days = 3;
      else if (totalScore <= 16) days = 5;
      else if (totalScore <= 17) days = 8;
      else days = 13;
      
      setDayEstimate(days);
    }

    setShowResult(true);
  };

  const calculateTimeEstimation = () => {
    if (!storyPoints && !dayEstimate) {
      alert('Please calculate story points or days first.');
      return;
    }

    let baseDays;
    
    if (estimationType === 'story_points' && storyPoints) {
      // Convert story points to days using team velocity
      const pointsPerDay = timeEstimation.teamVelocity / timeEstimation.sprintLength;
      baseDays = storyPoints / pointsPerDay;
    } else if (estimationType === 'days' && dayEstimate) {
      baseDays = dayEstimate;
    }

    // Apply buffer percentage
    const bufferedDays = baseDays * (1 + timeEstimation.bufferPercentage / 100);
    const totalHours = bufferedDays * timeEstimation.workingHoursPerDay;

    // Three-point estimation
    const optimisticDays = baseDays * 0.8;
    const pessimisticDays = baseDays * 1.5;
    const expectedDays = (optimisticDays + (4 * baseDays) + pessimisticDays) / 6;

    setTimeResults({
      baseDays: Math.round(baseDays * 10) / 10,
      bufferedDays: Math.round(bufferedDays * 10) / 10,
      totalHours: Math.round(totalHours),
      optimisticDays: Math.round(optimisticDays * 10) / 10,
      expectedDays: Math.round(expectedDays * 10) / 10,
      pessimisticDays: Math.round(pessimisticDays * 10) / 10
    });

    setShowTimeEstimation(true);
  };

  const resetForm = () => {
    setResponses({
      dependencies: null,
      knowledge: null,
      repetition: null,
      complexity: null,
      risk: null,
      duration: null
    });
    setStoryPoints(null);
    setDayEstimate(null);
    setShowResult(false);
    setShowTimeEstimation(false);
    setTimeResults(null);
  };

  const getScoreColor = (score) => {
    if (score <= 8) return 'bg-green-100 text-green-800';
    if (score <= 12) return 'bg-yellow-100 text-yellow-800';
    if (score <= 16) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const getProgressPercentage = () => {
    const answeredQuestions = Object.values(responses).filter(response => response !== null).length;
    return (answeredQuestions / questions.length) * 100;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Agile Estimation Tool</h1>
        <p className="text-gray-600">Systematically evaluate user stories for accurate estimation</p>
        
        {/* Estimation Type Selector */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => setEstimationType('story_points')}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              estimationType === 'story_points'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 border hover:bg-gray-50'
            }`}
          >
            <Target className="w-4 h-4" />
            Story Points
          </button>
          <button
            onClick={() => setEstimationType('days')}
            className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
              estimationType === 'days'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-700 border hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Days
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6 w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {Object.values(responses).filter(r => r !== null).length} of {questions.length} questions answered
        </p>
      </div>

      <div className="grid gap-6 mb-8">
        {questions.map((question, index) => (
          <Card key={question.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                  {index + 1}
                </span>
                {question.title}
              </CardTitle>
              <CardDescription className="text-base">
                {question.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 flex-wrap">
                {question.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionSelect(question.id, option.value)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all font-medium ${
                      responses[question.id] === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4 justify-center mb-8">
        <Button 
          onClick={calculateEstimation}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8"
        >
          <Calculator className="w-4 h-4 mr-2" />
          Calculate {estimationType === 'story_points' ? 'Story Points' : 'Days'}
        </Button>
        
        <Button 
          onClick={resetForm}
          variant="outline"
          size="lg"
          className="px-8"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>

      {showResult && (storyPoints !== null || dayEstimate !== null) && (
        <Card className="shadow-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-blue-900">Estimation Result</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="inline-flex items-center gap-4">
              <div className="text-6xl font-bold text-blue-600">
                {estimationType === 'story_points' ? storyPoints : dayEstimate}
              </div>
              <div className="text-left">
                <div className="text-lg font-semibold text-gray-700">
                  {estimationType === 'story_points' ? 'Story Points' : 'Days'}
                </div>
                <Badge className={`${getScoreColor(Object.values(responses).reduce((sum, value) => sum + value, 0))}`}>
                  Total Score: {Object.values(responses).reduce((sum, value) => sum + value, 0)}/18
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6 text-sm">
              {questions.map((question, index) => (
                <div key={question.id} className="bg-white p-3 rounded-lg border">
                  <div className="font-medium text-gray-700">{question.title}</div>
                  <div className="text-blue-600 font-semibold">
                    {question.options.find(opt => opt.value === responses[question.id])?.label} ({responses[question.id]})
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Time Estimation Section */}
      {showResult && (storyPoints !== null || dayEstimate !== null) && (
        <Card className="shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Time Estimation Settings
            </CardTitle>
            <CardDescription>
              Configure your team parameters for accurate time estimation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Team Velocity (Story Points per Sprint)
                  </label>
                  <input
                    type="number"
                    value={timeEstimation.teamVelocity}
                    onChange={(e) => setTimeEstimation(prev => ({...prev, teamVelocity: Number(e.target.value)}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sprint Length (Working Days)
                  </label>
                  <input
                    type="number"
                    value={timeEstimation.sprintLength}
                    onChange={(e) => setTimeEstimation(prev => ({...prev, sprintLength: Number(e.target.value)}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buffer Percentage (%)
                  </label>
                  <input
                    type="number"
                    value={timeEstimation.bufferPercentage}
                    onChange={(e) => setTimeEstimation(prev => ({...prev, bufferPercentage: Number(e.target.value)}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Working Hours per Day
                  </label>
                  <input
                    type="number"
                    value={timeEstimation.workingHoursPerDay}
                    onChange={(e) => setTimeEstimation(prev => ({...prev, workingHoursPerDay: Number(e.target.value)}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
            
            <Button 
              onClick={calculateTimeEstimation}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <Clock className="w-4 h-4 mr-2" />
              Calculate Time Estimation
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Time Estimation Results */}
      {showTimeEstimation && timeResults && (
        <Card className="shadow-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-900">Time Estimation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-3xl font-bold text-green-600">{timeResults.baseDays}</div>
                <div className="text-sm text-gray-600">Base Days</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-3xl font-bold text-blue-600">{timeResults.bufferedDays}</div>
                <div className="text-sm text-gray-600">With Buffer</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <div className="text-3xl font-bold text-purple-600">{timeResults.totalHours}</div>
                <div className="text-sm text-gray-600">Total Hours</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h3 className="font-semibold text-gray-800 mb-4">Three-Point Estimation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{timeResults.optimisticDays}</div>
                  <div className="text-sm text-gray-600">Optimistic (Best Case)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-500">{timeResults.expectedDays}</div>
                  <div className="text-sm text-gray-600">Expected (Most Likely)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{timeResults.pessimisticDays}</div>
                  <div className="text-sm text-gray-600">Pessimistic (Worst Case)</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Estimation Methods Used:</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div><span className="font-medium">Base Estimation:</span> {estimationType === 'story_points' ? 'Story points converted using team velocity' : 'Direct days estimation'}</div>
                <div><span className="font-medium">Buffer:</span> {timeEstimation.bufferPercentage}% added for unexpected issues</div>
                <div><span className="font-medium">Three-Point:</span> PERT formula for realistic time ranges</div>
                <div><span className="font-medium">Team Velocity:</span> {timeEstimation.teamVelocity} points per {timeEstimation.sprintLength} days</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StoryPointsEstimator;