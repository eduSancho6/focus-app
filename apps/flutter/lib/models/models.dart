class TaskModel {
  final String id;
  final String description;
  final bool completed;
  final String? completedAt;
  final String type;
  final String? focusFeedback;
  final int effortPoints;
  final String? projectId;
  final String? parentId;

  TaskModel({
    required this.id,
    required this.description,
    required this.completed,
    this.completedAt,
    required this.type,
    this.focusFeedback,
    required this.effortPoints,
    this.projectId,
    this.parentId,
  });

  factory TaskModel.fromJson(Map<String, dynamic> json) {
    return TaskModel(
      id: json['id'] as String,
      description: json['description'] as String,
      completed: json['completed'] as bool,
      completedAt: json['completedAt'] as String?,
      type: json['type'] as String,
      focusFeedback: json['focusFeedback'] as String?,
      effortPoints: json['effortPoints'] as int,
      projectId: json['projectId'] as String?,
      parentId: json['parentId'] as String?,
    );
  }
}

class AreaModel {
  final String id;
  final String name;

  AreaModel({required this.id, required this.name});

  factory AreaModel.fromJson(Map<String, dynamic> json) {
    return AreaModel(id: json['id'] as String, name: json['name'] as String);
  }
}

class ProjectModel {
  final String id;
  final String name;
  final bool completed;

  ProjectModel({required this.id, required this.name, required this.completed});

  factory ProjectModel.fromJson(Map<String, dynamic> json) {
    return ProjectModel(
      id: json['id'] as String,
      name: json['name'] as String,
      completed: json['completed'] as bool,
    );
  }
}

class HabitModel {
  final String id;
  final String name;

  HabitModel({required this.id, required this.name});

  factory HabitModel.fromJson(Map<String, dynamic> json) {
    return HabitModel(id: json['id'] as String, name: json['name'] as String);
  }
}

class WeeklyCapacityModel {
  final String id;
  final int weekNumber;
  final int year;
  final int totalBudgetPoints;
  final int usedPoints;

  WeeklyCapacityModel({
    required this.id,
    required this.weekNumber,
    required this.year,
    required this.totalBudgetPoints,
    required this.usedPoints,
  });

  factory WeeklyCapacityModel.fromJson(Map<String, dynamic> json) {
    return WeeklyCapacityModel(
      id: json['id'] as String,
      weekNumber: json['weekNumber'] as int,
      year: json['year'] as int,
      totalBudgetPoints: json['totalBudgetPoints'] as int,
      usedPoints: json['usedPoints'] as int,
    );
  }
}
