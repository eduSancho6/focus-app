import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  static const String baseUrl = 'http://localhost:3000';

  final http.Client _client = http.Client();
  final String Function() _getToken;

  ApiService({required String Function() getToken}) : _getToken = getToken;

  Map<String, String> get _headers => {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${_getToken()}',
  };

  Future<Map<String, dynamic>> get(String path) async {
    final response = await _client.get(Uri.parse('$baseUrl$path'), headers: _headers);
    if (response.statusCode == 200) {
      return jsonDecode(response.body) as Map<String, dynamic>;
    }
    throw HttpException(response.statusCode, response.body);
  }

  Future<List<dynamic>> getList(String path) async {
    final response = await _client.get(Uri.parse('$baseUrl$path'), headers: _headers);
    if (response.statusCode == 200) {
      return jsonDecode(response.body) as List<dynamic>;
    }
    throw HttpException(response.statusCode, response.body);
  }

  Future<Map<String, dynamic>> post(String path, Map<String, dynamic> body) async {
    final response = await _client.post(
      Uri.parse('$baseUrl$path'),
      headers: _headers,
      body: jsonEncode(body),
    );
    if (response.statusCode == 201 || response.statusCode == 200) {
      return jsonDecode(response.body) as Map<String, dynamic>;
    }
    throw HttpException(response.statusCode, response.body);
  }

  Future<Map<String, dynamic>> patch(String path, Map<String, dynamic> body) async {
    final response = await _client.patch(
      Uri.parse('$baseUrl$path'),
      headers: _headers,
      body: jsonEncode(body),
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body) as Map<String, dynamic>;
    }
    throw HttpException(response.statusCode, response.body);
  }

  Future<void> delete(String path) async {
    final response = await _client.delete(Uri.parse('$baseUrl$path'), headers: _headers);
    if (response.statusCode != 200) {
      throw HttpException(response.statusCode, response.body);
    }
  }

  Future<Map<String, dynamic>> createTask({
    required String description,
    required String type,
    int effortPoints = 10,
    String? projectId,
    String? parentId,
  }) {
    return post('/tasks', {
      'description': description,
      'type': type,
      'effortPoints': effortPoints,
      if (projectId != null) 'projectId': projectId,
      if (parentId != null) 'parentId': parentId,
    });
  }

  Future<Map<String, dynamic>> completeTask(String taskId, String feedback) {
    return post('/tasks/$taskId/complete', {'feedback': feedback});
  }

  Future<List<dynamic>> getAreas() => getList('/areas');
  Future<Map<String, dynamic>> createArea(String name) => post('/areas', {'name': name});
  Future<void> deleteArea(String id) => delete('/areas/$id');

  Future<List<dynamic>> getSubareas() => getList('/subareas');
  Future<Map<String, dynamic>> createSubarea(String name, String areaId) {
    return post('/subareas', {'name': name, 'areaId': areaId});
  }
  Future<void> deleteSubarea(String id) => delete('/subareas/$id');

  Future<List<dynamic>> getProjects() => getList('/projects');
  Future<Map<String, dynamic>> createProject(String name, String subareaId) {
    return post('/projects', {'name': name, 'subareaId': subareaId});
  }
  Future<Map<String, dynamic>> updateProject(String id, {String? name, bool? completed}) {
    return patch('/projects/$id', {
      if (name != null) 'name': name,
      if (completed != null) 'completed': completed,
    });
  }
  Future<void> deleteProject(String id) => delete('/projects/$id');

  Future<List<dynamic>> getHabits() => getList('/habits');
  Future<Map<String, dynamic>> createHabit(String name) => post('/habits', {'name': name});
  Future<void> deleteHabit(String id) => delete('/habits/$id');

  Future<List<dynamic>> getWeeklyCapacities({int? weekNumber, int? year}) {
    final params = <String, String>{};
    if (weekNumber != null) params['weekNumber'] = weekNumber.toString();
    if (year != null) params['year'] = year.toString();
    final query = params.entries.map((e) => '${e.key}=${e.value}').join('&');
    return getList('/weekly-capacity${query.isNotEmpty ? '?$query' : ''}');
  }

  Future<Map<String, dynamic>> createWeeklyCapacity({
    required int weekNumber,
    required int year,
    int totalBudgetPoints = 100,
  }) {
    return post('/weekly-capacity', {
      'weekNumber': weekNumber,
      'year': year,
      'totalBudgetPoints': totalBudgetPoints,
    });
  }

  void dispose() {
    _client.close();
  }
}

class HttpException implements Exception {
  final int statusCode;
  final String body;
  HttpException(this.statusCode, this.body);
  @override
  String toString() => 'HTTP $statusCode: $body';
}
