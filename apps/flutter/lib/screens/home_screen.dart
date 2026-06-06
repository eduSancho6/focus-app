import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'tasks_screen.dart';
import 'areas_screen.dart';
import 'habits_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final ApiService _api = ApiService();
  int _selectedIndex = 0;
  bool _serverAlive = false;
  bool _checking = true;

  @override
  void initState() {
    super.initState();
    _checkServer();
  }

  Future<void> _checkServer() async {
    try {
      await _api.getList('/areas');
      setState(() {
        _serverAlive = true;
        _checking = false;
      });
    } catch (e) {
      setState(() {
        _serverAlive = false;
        _checking = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_checking) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (!_serverAlive) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.cloud_off, size: 64, color: Colors.red),
              const SizedBox(height: 16),
              const Text('Server not reachable', style: TextStyle(fontSize: 18)),
              const SizedBox(height: 8),
              const Text('Start the backend with: npm run start:dev\n\nAPI URL: http://10.0.2.2:3000'),
              const SizedBox(height: 24),
              ElevatedButton(onPressed: () { setState(() => _checking = true); _checkServer(); }, child: const Text('Retry')),
            ],
          ),
        ),
      );
    }

    final screens = [
      TasksScreen(api: _api),
      AreasScreen(api: _api),
      HabitsScreen(api: _api),
    ];

    return Scaffold(
      appBar: AppBar(title: const Text('Focus App')),
      body: screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (i) => setState(() => _selectedIndex = i),
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.task), label: 'Tasks'),
          BottomNavigationBarItem(icon: Icon(Icons.folder), label: 'Areas'),
          BottomNavigationBarItem(icon: Icon(Icons.repeat), label: 'Habits'),
        ],
      ),
    );
  }
}
