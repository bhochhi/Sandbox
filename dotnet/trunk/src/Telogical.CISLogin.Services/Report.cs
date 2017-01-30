using System;

namespace MyLogical.MyLogin.Services
{
    public class Report
    {
        private string _reportName;
        public bool IsValid { get; set; }
        private string _fileType;
        private string _filePath;

        public Report AddFileName(string reportName)
        {
            _reportName = reportName;
            return this;
        }

        public string GetFileName()
        {
            return _reportName;
        }

        public Report SetContentType(string fileType)
        {
            _fileType = fileType;
            return this;
        }

        public string GetFileType()
        {
            return _fileType;
        }

        public Report SetFilePath(string filePath)
        {
            _filePath = filePath;
            return this;
        }

        public string GetFilePath()
        {
            return _filePath;
        }
    }
}